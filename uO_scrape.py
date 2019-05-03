import requests
from bs4 import BeautifulSoup
import urllib
import pandas as pd
import json
from time import sleep, perf_counter as pf
import regex as re
import itertools as it

requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ':DES-CBC3-SHA'
#timetable_url = 'https://web30.uottawa.ca/v3/SITS/timetable/Search.aspx'
code_re = re.compile("[A-Z]{3}[ ]{0,1}[0-9]{4,5}[A-Za-z]{0,1}")
credit_re = re.compile(r"\([0-9]{1,} (unit[s]{0,1}|crédit[s]{0,1})\)|[0-9]{1,} (unit[s]{0,1}|crédit[s]{0,1})")


def scrape_subjects():
	'''
	Scrapes the list of subjects with links to their respective course catalogues from the uOttawa website
	() -> pandas DataFrame with columns: Subject, Code, Link
	Used in get_subjects.ipynb
	'''
	url = 'https://catalogue.uottawa.ca/en/courses/'
	page = requests.get(url).text

	soup = BeautifulSoup(page, 'html.parser')
	content = soup.find('div', attrs = {'class':'az_sitemap'})

	href_re = re.compile("[/]{0,1}en/courses/[A-Za-z]{1,}[/]{0,1}")
	subj_tags = content.find_all('a', attrs = {'href':href_re})

	subj_table = []
	for tag in subj_tags:
		subj_table.append([tag.string, tag['href'].strip('/').rsplit('/')[-1]])

	subjects = pd.DataFrame(subj_table, columns=['Subject', 'Code'])
	subjects['Code'] = subjects['Code'].str.strip().str.strip('/')
	subjects['Link'] = url + subjects['Code'] + '/'
	subj_re = re.compile(r"\([A-Z]{3}\)")
	subjects.Subject = subjects.Subject.str.replace(subj_re, '').str.strip()
	return subjects

def extract_codes(string, return_all = True):
	'''
	Returns course codes found in string; 
	if multiple codes are found and return_all is False, then returns an invalid code
	Used in get_subjects.ipynb
	'''
	codes = list({x.group(0) for x in re.finditer(code_re, string)})
	if return_all or len(codes) == 1:
		return codes
	return 'XXX 0000'

def extract_credits(string):
	'''
	Searches string for a number of credits/units
	(Assuming the string is the title of a course)
	Used in get_subjects.ipynb
	'''
	credits = list({int(x.group(0).split(' ')[0].strip('(')) for x in re.finditer(credit_re, string)})
	if len(credits) == 1:
		return credits
	return [0]

def get_courses(link):
	'''
	Scrapes the page given by link for courses and their descriptions, components, prerequisites, etc.
	Used in get_subjects.ipynb
	'''
	courses = []
	raw_courses = BeautifulSoup(requests.get(link).text, 'html.parser')
	raw_courses = raw_courses.find_all('div', attrs = {'class':'courseblock'})
	for course in raw_courses:
		try:
			title = course.find('p', attrs={'class':'courseblocktitle'}).text.replace('\xa0', ' ').strip()
		except AttributeError as e:
			print(course)
			raise e
		else:
			code = extract_codes(title, False)[0]
			credits = extract_credits(title)[0]
			title = re.sub(code_re, '', title)
			title = re.sub(credit_re, '', title).strip()
		try:
			desc = course.find('p', attrs={'class':'courseblockdesc'})
			desc = desc.text.replace('\xa0', ' ').strip()
		except AttributeError as e:
			if desc is None:
				desc = ''
			else:
				print(course)
				raise e
		#parsing the course component and prerequisite info from the courseblockextra and distinguishing them
		blocks = []
		for block in course.find_all('p', attrs={'class':'courseblockextra'}):
			try:
				blocks.append(block.text.replace('\xa0', ' ').strip().strip('.'))
			except AttributeError as e:
				print(course)
				print(block)
				raise e
		if len(blocks) == 0:
			comp = ''
			pre = ''
		elif len(blocks) == 1:
			if ("Volet" in blocks[0]) or ("Course Component" in blocks[0]):
				comp = blocks[0]
				pre = ''
			elif ("Préalable" in blocks[0]) or ("Prerequisite" in blocks[0]):
				comp = ''
				pre = blocks[0]
			else:
				comp = ''
				pre = ''
		elif len(blocks) == 2:
			cond_comp0 = ("Volet" in blocks[0]) or ("Course Component" in blocks[0])
			cond_pre1 = ("Préalable" in blocks[1]) or ("Prerequisite" in blocks[1])
			cond_comp1 = ("Volet" in blocks[1]) or ("Course Component" in blocks[1])
			cond_pre0 = ("Préalable" in blocks[0]) or ("Prerequisite" in blocks[0])
			if cond_comp0 and not cond_pre0:
				comp = blocks[0]
			elif cond_comp1 and not cond_pre1:
				comp = blocks[1]
			else:
				comp = ''
			if cond_pre0 and not cond_comp0:
				pre = blocks[0]
			elif cond_pre1 and not cond_comp1:
				pre = blocks[1]
			else:
				pre = ''
		else:
			comp = ''
			pre = ''
		#adding component info to the end of the description
		desc = desc + '\n' + comp
		desc = desc.strip()
		#getting the components from after the colon in the sentence
		comp = comp.split(':', 1)[-1].strip()
		comp = [x.strip() for x in comp.split('/')[-1].split(',')]
		#getting the prerequisites from after the colon in the sentence
		pre = Prereq(pre)
		dep = None
		# pre = pre.split(':', 1)[-1].strip()
		# #extracting dependencies from the prerequisite list
		# dep = extract_codes('.'.join([x for x in pre.split('.') if ('cannot' not in x) and ('Must' not in x)]))
		# dep = set(dep).difference({code})
		courses.append([code, title, credits, desc, comp, pre.prereqs, dep])
	return pd.DataFrame(courses, columns = ['code', 'title', 'credits', 'desc', 'components', 'prerequisites', 'dependencies'])

class Prereq:
	'''
	Object used to hold information about prereqs and other information that is provided in the courseblockextra section of the uOttawa catalogue
	'''
	credit_count_code = "YYY0000"
	code_4U = "YYY0001"

	course_code_pattern = r"[A-Z]{3}\s*[0-9]{4,5}[A-Za-z]{0,1}"
	not_real_course_codes = r"(?P<ForU>.*[34]U.*)|(?:an )?equivalent|Permission of the School|Permission de l'(?:École|Institut)|Approval of the instructor|Permission du Département"
	faculties = r"(?:[Mm]athematics|[Mm]athématiques|[Ss]cience)"
	credit_count = r"(?P<credit_count>\d+ crédits de cours(?: en)?(?: %s)? \(?(?:[A-Z]{3}\)?(?: ou [A-Z]{3})* de niveau \d000(?: ou supérieur)*|universitaire)|\d+(?: course)? units (?:of|in)(?: %s)? \(?(?:[A-Z]{3}\)?(?: or [A-Z]{3})*(?: courses)? at(?: the| level)? \d000(?: level)?(?: or above)?|university-level courses?))" % (faculties, faculties)
	for_special_program = r"(?P<for_special_program> or for honors %s students: | ou pour les étudiants et étudiantes inscrits aux programmes spécialisés en %s : )" % (faculties, faculties)
	parsable_codes = r"(?:\(*(?:%s)\)*(?:, |/| or | ou | and | et |%s)?)+" % (course_code_pattern + '|' + not_real_course_codes + '|(?:' + credit_count + ')', for_special_program)

	patterns = {
		"not_combined_for_credits" : re.compile(r"(?:(?<=^(?:(?:The )?[Cc]ourses |Les cours ))%s(?=(?: cannot be combined for (?:units|credits)$| ne peuvent être combinés pour l'obtention de crédits$))|(?<=This course cannot be taken for units by any student who has previously received units for )%s$)" % (parsable_codes, course_code_pattern)),
		"no_credits_in_program" : re.compile(r"(?:This course cannot count for unit in any program in the Faculty of |Prerequisite: This course cannot count as a %s elective for students in the Faculty of |Ce cours ne peut pas compter pour fin de crédits dans un programme de la Faculté des |Préalable : Ce cours ne peut pas compter comme cours au choix en %s pour les étudiants et étudiantes de la Faculté des )%s" % (faculties, faculties, faculties)),
		"prerequisites" : re.compile(r"(?<=^(?:/ )?(?:Prerequisite|Préalable)s?\s*:\s*(?:One of )?)%s$" % parsable_codes),
		"corequisite" : re.compile(r"(?:Corequisite|Concomitant)\s*:\s*%s|%s(?= are prerequisite or corequisite to %s$)|(?<=Les cours )%s(?= sont préalables ou concomitants à %s$)" % (parsable_codes, parsable_codes, course_code_pattern, parsable_codes, course_code_pattern)),
		"CGPA_requirements" : re.compile(r"(?:Prerequisite: The student must have a minimum CGPA of \d(?:\.|,)\d|Préalable : L'étudiant ou l'étudiante doit avoir conservé une MPC minimale de \d(?:\.|,)\d|Seulement disponible pour les étudiants ayant une MPC de \d,\d et plus)|Open only to students whose cumulative grade point average is \d\.\d or over(?: and the permission of the Department| et avoir la permission du Département)?(?:, and who have completed all the first(?: and second)? year [A-Z]{3} core courses of their program| et ayant réussi tous les cours [A-Z]{3} du tronc commun de niveaux 1000(?: et 2000)? de leur programme)?$"),
		# "credit_count" : re.compile(r"Préalable ?: \d+ crédits de cours(?: en)?(?: %s)? \(?(?:[A-Z]{3}\)?(?: ou [A-Z]{3})* de niveau \d000(?: ou supérieur)*|universitaire)|Prerequisite: \d+(?: course)? units (?:of|in)(?: %s)? \(?(?:[A-Z]{3}\)?(?: or [A-Z]{3})*(?: courses)? at(?: the| level)? \d000(?: level)?(?: or above)?|university-level courses?)$" % (faculties, faculties)),
		#TODO: do some testing to see if you still need this seperate or if it's ok only being part of the prerequisite pattern

		"prior_knowledge" : re.compile(r"Prerequisites: familiarity with basic concepts in .*|(?:or )?A basic knowledge of .*$|Prerequisite: Some familiarity with .*"),
		"additional_prereqs" : re.compile(r"Additional prerequisites may be imposed depending on the topic|Des préalables supplémentaires peuvent s'appliquer selon le sujet du cours"),
		"permission" : re.compile(r"Permission of the Department is required$|Permission du Département est requise.?$"),	#TODO: This should be combined with "not_real_course_codes" or be moved here on it's own
		"interview" : re.compile(r"Interview with Professor is required$|Entrevue avec le professeur est requise$"),

		"also_offered_as" : re.compile(r"(?<=^(?:Also offered as |Aussi offert sous la cote ))%s$" % course_code_pattern),
		"primarily_intended_for" : re.compile(r"[Tt]his course is .* for .*$|Ce cours .* principalement(?: destiné)? aux étudiants et étudiantes .*$"),
		"previously" : re.compile(r"(?:Previously|Antérieurement) %s" % course_code_pattern),
	}

	def parse_codes(self, parsable):
		'''
		Truns a string of parsable codes into a list of prerequiste groups that are each sufficient to get into the course
		A string of parsable codes is defined as any string of courses codes seperated by any of [/ or ou , and et] and parentheses for priotirty.
		'''

		parsable = self.match_to_string(parsable)

		#Replace all parenthesised groups with a unique fake course code
		replacement_codes = ("XXX%04d" % i for i in it.count())
		codes = []
		for code in replacement_codes:
			pos = -1
			for i, c in enumerate(parsable):
				if c == '(':
					pos = i
				elif c == ')':
					codes.append((code, parsable[pos+1:i]))
					parsable = parsable[:pos] + code + parsable[i+1:]
					break	#This increments to the next replacement code and starts from the beginning of the string
			else:	#When we reach the end of the string we're done
				break

		#Add final group to the codes array to handle top level or groups
		code = next(replacement_codes)
		codes.append((code, parsable))
		prereq_groups = [[code]]

		#Handle mixed "and" and "or" groups into individual codes
		new_codes = []
		for code, replacement in codes:
			replacement = replacement.split(", ")
			if len(replacement) > 1:
				for i, item in enumerate(replacement):
					if " or " in item:
						new_code = next(replacement_codes)
						new_codes.append((new_code, item))
						replacement[i] = new_code
			new_codes.append((code, ", ".join(replacement)))
		codes = new_codes

		#Sub fake codes back in for a list of possible prereq groups
		for code, replacement in reversed(codes):
			while True:	#This is to overcome the problem with modifying a list as you iterate over it, kind of a hack but it works
				for group in prereq_groups:
					if code in group:
						if ", " in replacement:
							group.remove(code)
							group += replacement.split(", ")
						elif " or " in replacement:
							prereq_groups.remove(group)
							group.remove(code)
							for c in replacement.split(" or "):
								prereq_groups.append(group + [c])
							break
						else:
							group.remove(code)
							group += [replacement]
				else:
					break

		return prereq_groups



	def match_to_string(self, match_obj):
		'''
		Converts a match object to a string that can be parsed
		by the parse_codes function and populates some substitute
		course code values if present.
		'''

		match_str = match_obj.group()

		# The try is for when the pattern didn't include those groups,
		# the if is if they were included but not part of the match
		try:
			if match_obj.group("credit_count") != None:
				self.credit_count_sub = match_obj.group("credit_count")
				match_str = match_str.replace(match_obj.group("credit_count"), self.credit_count_code)
		except IndexError:
			pass
		try:
			if match_obj.group("ForU") != None:
				self.sub_4U = match_obj.group("ForU")
				match_str = match_str.replace(match_obj.group("ForU"), self.code_4U)
		except IndexError:
			pass
		try:
			if match_obj.group("for_special_program") != None:
				self.for_special_program_sub = match_obj.group("for_special_program")
				match_str = "(" + match_str + ")"
				match_str = match_str.replace(match_obj.group("for_special_program"), ") or (")
		except IndexError:
			pass

		match_str = match_str.replace(" ou ", " or ").replace("/", " or ").replace(" and ", ", ").replace(" et ", ", ")

		return match_str

	def __init__(self, prereqStr):

		self.prereqs = []

		sentences = filter(None, prereqStr.replace(' / ', '. ').split('. '))
		for sentence in sentences:
			for key, pattern in self.patterns.items():
				match = pattern.search(sentence)
				if match:
					if key == "prerequisites":
						self.prereqs = self.parse_codes(match)
					break
			else:
				pass

def get_course_tables(links):
	'''
	Returns a dictionary of pandas DataFrames of courses from each of the links provided in links
	The keys are the subject code portion of the link (the last bit separated by /)
	Used in get_subjects.ipynb
	'''
	course_tables = dict()
	for link in links:
		code = link.strip('/').rsplit('/')[-1]
		try:
			course_tables[code] = get_courses(link)
		except AttributeError as e:
			print("Attribute Error:")
			print(link)
			print(e)
			print("Continuing...")
	return course_tables

def get_subjects():
	'''
	Returning a pandas DataFrame of the subjects parsed and saved
	'''
	return pd.read_csv("uOttawa_subjects.csv")

def read_courses(subjects = None):
	'''
	Returns a dictionary of pandas DataFrames of courses; keys are subject codes; takes data from the file created during scraping
	If an iterable of subject codes is supplied, only those subjects are returned
	'''
	with open("uOttawa_courses.json") as f:
		courses = json.load(f)
	#course_tables = dict()
	if subjects is None:
		return {key:pd.read_json(courses[key]) for key in courses}
	return {key:pd.read_json(courses[key]) for key in courses if key in subjects}

def get_form(timetable_url = 'https://web30.uottawa.ca/v3/SITS/timetable/Search.aspx'):
	'''
	Returns a dictionary used in the POST request when searching the timetable for a course
	Used in get_schedules.ipynb
	'''
	s = "__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwULLTE3OTIzMzIxNzIPZBYCZg9kFgYCBQ8WAh4EVGV4dGRkAgoPFgIfAAUCZW5kAg0PZBYGAgMPDxYCHwAFCUZyYW7Dp2FpcxYGHgNyZWwFCWFsdGVybmF0ZR4EbGFuZwUFZnItQ0EeCGhyZWZsYW5nBQVmci1DQWQCCA8WAh8ABQdzcGFuLTE4ZAIJD2QWEgIXDxBkEBUDA0FsbA4yMDE4IEZhbGwgVGVybRAyMDE5IFdpbnRlciBUZXJtFQMABDIxODkEMjE5MRQrAwNnZ2dkZAIzDxBkEBWZAQNBbGwSQWJvcmlnaW5hbCBTdHVkaWVzCkFjY291bnRpbmcMQWN0aXZlIENPLU9QDkFkbWluaXN0cmF0aW9uFkFuYXRvbXkgYW5kIFBoeXNpb2xvZ3kMQW50aHJvcG9sb2d5G0FyYWJpYyBMYW5ndWFnZSBhbmQgQ3VsdHVyZQpBcnRzIENPLU9QFEFydHMsIE11c2ljLCBUaGVhdHJlDUFzaWFuIFN0dWRpZXMUQmlsaW5ndWFsaXNtIFN0dWRpZXMMQmlvY2hlbWlzdHJ5DkJpb2luZm9ybWF0aWNzB0Jpb2xvZ3kWQmlvbWVkaWNhbCBFbmdpbmVlcmluZxNCaW9tZWRpY2FsIFNjaWVuY2VzGkJpb3BoYXJtYWNldXRpY2FsIFNjaWVuY2VzDUJpb3RlY2hub2xvZ3kQQ2FuYWRpYW4gU3R1ZGllcx9DZWxsdWxhciBhbmQgTW9sZWN1bGFyIE1lZGljaW5lDkNlbHRpYyBTdHVkaWVzJUNoZW1pY2FsIGFuZCBFbnZpcm9ubWVudGFsIFRveGljb2xvZ3kUQ2hlbWljYWwgRW5naW5lZXJpbmcJQ2hlbWlzdHJ5B0NoaW5lc2URQ2l2aWwgRW5naW5lZXJpbmcJQ2l2aWwgTGF3EUNsYXNzaWNhbCBTdHVkaWVzCENsYXNzaWNzEUNsaW5pY2FsIFJvdGF0aW9uCkNvbW1vbiBMYXcNQ29tbXVuaWNhdGlvbg1Db21tdW5pY2F0aW9uGENvbW11bml0eSBIZWFsdGggTnVyc2luZxpDb21wbGV4IFByb2plY3QgTGVhZGVyc2hpcBRDb21wdXRlciBFbmdpbmVlcmluZxBDb21wdXRlciBTY2llbmNlEENvbmZsaWN0IFN0dWRpZXMhQ29uZmxpY3QgU3R1ZGllcyBhbmQgSHVtYW4gUmlnaHRzC0NyaW1pbm9sb2d5J0Nyb3NzIGluc3RpdHV0aW9uIGNvdXJzZSB0YWtlbiBhdCBTUEFVTAxEYXRhIFNjaWVuY2USRGlnaXRhbCBIdW1hbml0aWVzDURyYW1hdGljIEFydHMJRWNvbm9taWNzCUVkdWNhdGlvbiRFZHVjYXRpb24gOiBQcm9mZXNzaW9uYWwgRGV2ZWxvcG1lbnQdRWR1Y2F0aW9uIDogVGVhY2hlciBFZHVjYXRpb24cRWxlY3RpdmUgQ291cnNlcyBpbiBNZWRpY2luZRZFbGVjdHJpY2FsIEVuZ2luZWVyaW5nE0VsZWN0cm9uaWMgQnVzaW5lc3MLRW5naW5lZXJpbmcWRW5naW5lZXJpbmcgTWFuYWdlbWVudAdFbmdsaXNoHEVuZ2xpc2ggYXMgYSBTZWNvbmQgTGFuZ3VhZ2UZRW52aXJvbm1lbnRhbCBFbmdpbmVlcmluZxVFbnZpcm9ubWVudGFsIFNjaWVuY2UVRW52aXJvbm1lbnRhbCBTdHVkaWVzHEVudmlyb25tZW50YWwgU3VzdGFpbmFiaWxpdHkeRXBpZGVtaW9sb2d5IGFuZCBQdWJsaWMgSGVhbHRoGcOJdHVkZXMgZGVzIGZyYW5jb3Bob25pZXMNRXhlY3V0aXZlIE1CQQxGaWxtIFN0dWRpZXMjRmluYW5jaWFsIE1hdGhlbWF0aWNzIGFuZCBFY29ub21pY3MGRnJlbmNoG0ZyZW5jaCBhcyBhIFNlY29uZCBMYW5ndWFnZQtHRU5JRSBDTy1PUAlHZW9ncmFwaHkHR2VvbG9neRtHZXJtYW4gTGFuZ3VhZ2UgYW5kIEN1bHR1cmULR2Vyb250b2xvZ3khR3JvdXAgSW50ZXJ2ZW50aW9uIGFuZCBMZWFkZXJzaGlwFUhlYWx0aCBBZG1pbmlzdHJhdGlvbg9IZWFsdGggU2NpZW5jZXMOSGVhbHRoIFN5c3RlbXMHSGlzdG9yeRxIdW1hbiBhbmQgTW9sZWN1bGFyIEdlbmV0aWNzDkh1bWFuIEtpbmV0aWNzIEh1bWFuaXRpZXMsIFRoZW9sb2d5LCBQaGlsb3NvcGh5FEluZGlnZW5vdXMgTGFuZ3VhZ2VzE0luZm9ybWF0aW9uIFN0dWRpZXMWSW5mb3JtYXRpb24gVGVjaG5vbG9neR9JbnRlcmRpc2NpcGxpbmFyeSBTdHVkeSBpbiBBcnRzK0ludGVybmF0aW9uYWwgRGV2ZWxvcG1lbnQgYW5kIEdsb2JhbGl6YXRpb24mSW50ZXJwcm9mZXNzaW9uYWwgSGVhbHRoIENhcmUgUHJhY3RpY2UcSXRhbGlhbiBMYW5ndWFnZSBhbmQgQ3VsdHVyZQhKYXBhbmVzZQpKb3VybmFsaXNtFkxhdGluIEFtZXJpY2FuIFN0dWRpZXMDTGF3EUxhdyAoQ2VydGlmaWNhdGUpD0xlaXN1cmUgU3R1ZGllcxNMZXR0cmVzIGZyYW7Dp2Fpc2VzC0xpbmd1aXN0aWNzDk0uQi5BLiBQcm9ncmFtCk1hbmFnZW1lbnQLTWF0aGVtYXRpY3MWTWVjaGFuaWNhbCBFbmdpbmVlcmluZxpNZWRpY2FsIEludGVybiBvciBSZXNpZGVudAhNZWRpY2luZRBNZWRpZXZhbCBTdHVkaWVzG01pY3JvYmlvbG9neSBhbmQgSW1tdW5vbG9neQ9NaXNzaW9uIFN0dWRpZXMQTW9kZXJuIExhbmd1YWdlcwVNdXNpYwxOZXVyb3NjaWVuY2UHTnVyc2luZwlOdXRyaXRpb24UT2NjdXBhdGlvbmFsIFRoZXJhcHkdT3BodGhhbG1pYyBNZWRpY2FsIFRlY2hub2xvZ3kQUGFzdG9yYWwgU3R1ZGllcyNQYXRob2xvZ3kgYW5kIEV4cGVyaW1lbnRhbCBNZWRpY2luZQxQaGFybWFjb2xvZ3kKUGhpbG9zb3BoeQdQaHlzaWNzClBoeXNpb2xvZ3kNUGh5c2lvdGhlcmFweQZQb2xpc2gRUG9saXRpY2FsIFNjaWVuY2URUG9wdWxhdGlvbiBIZWFsdGgwUG9wdWxhdGlvbiBIZWFsdGggUmlzayBBc3Nlc3NtZW50IGFuZCBNYW5hZ2VtZW50ClBvcnR1Z3Vlc2UWUHJlLWludGVybnNoaXAgUHJvZ3JhbQpQc3ljaG9sb2d5FVB1YmxpYyBBZG1pbmlzdHJhdGlvbiBQdWJsaWMgYW5kIEludGVybmF0aW9uYWwgQWZmYWlycw1QdWJsaWMgRXRoaWNzDlJlaGFiaWxpdGF0aW9uEVJlbGlnaW91cyBTdHVkaWVzHFJ1c3NpYW4gTGFuZ3VhZ2UgYW5kIEN1bHR1cmUHU2NpZW5jZRtTY2llbmNlLCBTb2NpZXR5IGFuZCBQb2xpY3kYU2Vjb25kLUxhbmd1YWdlIFRlYWNoaW5nD1NvY2lhbCBTY2llbmNlcxVTb2NpYWwgU2NpZW5jZXMgQ08tT1AZU29jaWFsIFNjaWVuY2VzIG9mIEhlYWx0aAtTb2NpYWwgV29yawlTb2Npb2xvZ3kUU29mdHdhcmUgRW5naW5lZXJpbmcHU3BhbmlzaBlTcGVlY2gtTGFuZ3VhZ2UgUGF0aG9sb2d5D1N5c3RlbXMgU2NpZW5jZQdUaGVhdHJlCFRoZW9sb2d5C1RyYW5zbGF0aW9uJFRyYW5zbGF0aW9uYWwgYW5kIE1vbGVjdWxhciBNZWRpY2luZSBVbml2ZXJzYWwgVGhlc2lzIENvZGUgLSBNYXN0ZXIncxtVbml2ZXJzYWwgVGhlc2lzIENvZGUgLSBQaEQLVmlzdWFsIEFydHMPV29tZW4ncyBTdHVkaWVzHldvcmxkIExpdGVyYXR1cmVzIGFuZCBDdWx0dXJlcwdZaWRkaXNoFZkBAANFQVMDQ1BUA0NPUANBRE0DQU5QA0FOVANBUkIDQUNQA0FNVANBU0kDQklMA0JDSANCTkYDQklPA0JNRwNCSU0DQlBTA0JDRwNDRE4DQ01NA0NMVANUT1gDQ0hHA0NITQNDSE4DQ1ZHA0RSQwNDTEEDTENMA0NMSQNDTUwDSVNDA0NNTgNTU0MDQ1BMA0NFRwNDU0kDRUNTA0VDSANDUk0DWFNQA1NEUwNESE4DQURSA0VDTwNFRFUDUERQA1BFRANFTEUDRUxHA0VCQwNHTkcDRU1QA0VORwNFU0wDRVZHA0VWUwNFTlYDRVZEA0VQSQNFRlIDQURYA0NJTgNNRkUDRlJFA0ZMUwNDR0kDR0VHA0dFTwNBTEcDR1JUA0lHTANNSEEDSFNTA01IUwNISVMDSE1HA0FQQQNIVFADSUxBA0lTSQNJVEkDQUhMA0RWTQNTQUkDSVRBA0pQTgNKT1UDRUxBA0RDTANEQ0MDTFNSA0ZSQQNMSU4DTUJBA01HVANNQVQDTUNHA0lOUgNNRUQDTURWA01JQwNNSVMDTExNA01VUwNOU0MDTlNHA05VVANFUkcDT01UA0lQQQNQTUUDUEhBA1BISQNQSFkDUEhTA1BIVANQTE4DUE9MA1BPUANQSFIDUE9SA1BJUANQU1kDUEFQA0FQSQNFUEUDUkVBA1NSUwNSVVMDU0NJA0lTUANETFMDU0NTA0ZTUwNTU1MDU1ZTA1NPQwNTRUcDRVNQA09SQQNTWVMDVEhFA1RITwNUUkEDVE1NA1RITQNUSEQDQVJUA0ZFTQNMQ00DWUREFCsDmQFnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAI1Dw8WBB8ABTFZb3UgbXVzdCBhbHNvIGFkZCBhIENhdGFsb2cgTnVtYmVyIHRvIHlvdXIgc2VhcmNoHgdWaXNpYmxlaGRkAkMPEGQQFQMDQWxsDjIwMTggRmFsbCBUZXJtEDIwMTkgV2ludGVyIFRlcm0VAwAEMjE4OQQyMTkxFCsDA2dnZ2RkAmMPEGQQFZkBA0FsbBJBYm9yaWdpbmFsIFN0dWRpZXMKQWNjb3VudGluZwxBY3RpdmUgQ08tT1AOQWRtaW5pc3RyYXRpb24WQW5hdG9teSBhbmQgUGh5c2lvbG9neQxBbnRocm9wb2xvZ3kbQXJhYmljIExhbmd1YWdlIGFuZCBDdWx0dXJlCkFydHMgQ08tT1AUQXJ0cywgTXVzaWMsIFRoZWF0cmUNQXNpYW4gU3R1ZGllcxRCaWxpbmd1YWxpc20gU3R1ZGllcwxCaW9jaGVtaXN0cnkOQmlvaW5mb3JtYXRpY3MHQmlvbG9neRZCaW9tZWRpY2FsIEVuZ2luZWVyaW5nE0Jpb21lZGljYWwgU2NpZW5jZXMaQmlvcGhhcm1hY2V1dGljYWwgU2NpZW5jZXMNQmlvdGVjaG5vbG9neRBDYW5hZGlhbiBTdHVkaWVzH0NlbGx1bGFyIGFuZCBNb2xlY3VsYXIgTWVkaWNpbmUOQ2VsdGljIFN0dWRpZXMlQ2hlbWljYWwgYW5kIEVudmlyb25tZW50YWwgVG94aWNvbG9neRRDaGVtaWNhbCBFbmdpbmVlcmluZwlDaGVtaXN0cnkHQ2hpbmVzZRFDaXZpbCBFbmdpbmVlcmluZwlDaXZpbCBMYXcRQ2xhc3NpY2FsIFN0dWRpZXMIQ2xhc3NpY3MRQ2xpbmljYWwgUm90YXRpb24KQ29tbW9uIExhdw1Db21tdW5pY2F0aW9uDUNvbW11bmljYXRpb24YQ29tbXVuaXR5IEhlYWx0aCBOdXJzaW5nGkNvbXBsZXggUHJvamVjdCBMZWFkZXJzaGlwFENvbXB1dGVyIEVuZ2luZWVyaW5nEENvbXB1dGVyIFNjaWVuY2UQQ29uZmxpY3QgU3R1ZGllcyFDb25mbGljdCBTdHVkaWVzIGFuZCBIdW1hbiBSaWdodHMLQ3JpbWlub2xvZ3knQ3Jvc3MgaW5zdGl0dXRpb24gY291cnNlIHRha2VuIGF0IFNQQVVMDERhdGEgU2NpZW5jZRJEaWdpdGFsIEh1bWFuaXRpZXMNRHJhbWF0aWMgQXJ0cwlFY29ub21pY3MJRWR1Y2F0aW9uJEVkdWNhdGlvbiA6IFByb2Zlc3Npb25hbCBEZXZlbG9wbWVudB1FZHVjYXRpb24gOiBUZWFjaGVyIEVkdWNhdGlvbhxFbGVjdGl2ZSBDb3Vyc2VzIGluIE1lZGljaW5lFkVsZWN0cmljYWwgRW5naW5lZXJpbmcTRWxlY3Ryb25pYyBCdXNpbmVzcwtFbmdpbmVlcmluZxZFbmdpbmVlcmluZyBNYW5hZ2VtZW50B0VuZ2xpc2gcRW5nbGlzaCBhcyBhIFNlY29uZCBMYW5ndWFnZRlFbnZpcm9ubWVudGFsIEVuZ2luZWVyaW5nFUVudmlyb25tZW50YWwgU2NpZW5jZRVFbnZpcm9ubWVudGFsIFN0dWRpZXMcRW52aXJvbm1lbnRhbCBTdXN0YWluYWJpbGl0eR5FcGlkZW1pb2xvZ3kgYW5kIFB1YmxpYyBIZWFsdGgZw4l0dWRlcyBkZXMgZnJhbmNvcGhvbmllcw1FeGVjdXRpdmUgTUJBDEZpbG0gU3R1ZGllcyNGaW5hbmNpYWwgTWF0aGVtYXRpY3MgYW5kIEVjb25vbWljcwZGcmVuY2gbRnJlbmNoIGFzIGEgU2Vjb25kIExhbmd1YWdlC0dFTklFIENPLU9QCUdlb2dyYXBoeQdHZW9sb2d5G0dlcm1hbiBMYW5ndWFnZSBhbmQgQ3VsdHVyZQtHZXJvbnRvbG9neSFHcm91cCBJbnRlcnZlbnRpb24gYW5kIExlYWRlcnNoaXAVSGVhbHRoIEFkbWluaXN0cmF0aW9uD0hlYWx0aCBTY2llbmNlcw5IZWFsdGggU3lzdGVtcwdIaXN0b3J5HEh1bWFuIGFuZCBNb2xlY3VsYXIgR2VuZXRpY3MOSHVtYW4gS2luZXRpY3MgSHVtYW5pdGllcywgVGhlb2xvZ3ksIFBoaWxvc29waHkUSW5kaWdlbm91cyBMYW5ndWFnZXMTSW5mb3JtYXRpb24gU3R1ZGllcxZJbmZvcm1hdGlvbiBUZWNobm9sb2d5H0ludGVyZGlzY2lwbGluYXJ5IFN0dWR5IGluIEFydHMrSW50ZXJuYXRpb25hbCBEZXZlbG9wbWVudCBhbmQgR2xvYmFsaXphdGlvbiZJbnRlcnByb2Zlc3Npb25hbCBIZWFsdGggQ2FyZSBQcmFjdGljZRxJdGFsaWFuIExhbmd1YWdlIGFuZCBDdWx0dXJlCEphcGFuZXNlCkpvdXJuYWxpc20WTGF0aW4gQW1lcmljYW4gU3R1ZGllcwNMYXcRTGF3IChDZXJ0aWZpY2F0ZSkPTGVpc3VyZSBTdHVkaWVzE0xldHRyZXMgZnJhbsOnYWlzZXMLTGluZ3Vpc3RpY3MOTS5CLkEuIFByb2dyYW0KTWFuYWdlbWVudAtNYXRoZW1hdGljcxZNZWNoYW5pY2FsIEVuZ2luZWVyaW5nGk1lZGljYWwgSW50ZXJuIG9yIFJlc2lkZW50CE1lZGljaW5lEE1lZGlldmFsIFN0dWRpZXMbTWljcm9iaW9sb2d5IGFuZCBJbW11bm9sb2d5D01pc3Npb24gU3R1ZGllcxBNb2Rlcm4gTGFuZ3VhZ2VzBU11c2ljDE5ldXJvc2NpZW5jZQdOdXJzaW5nCU51dHJpdGlvbhRPY2N1cGF0aW9uYWwgVGhlcmFweR1PcGh0aGFsbWljIE1lZGljYWwgVGVjaG5vbG9neRBQYXN0b3JhbCBTdHVkaWVzI1BhdGhvbG9neSBhbmQgRXhwZXJpbWVudGFsIE1lZGljaW5lDFBoYXJtYWNvbG9neQpQaGlsb3NvcGh5B1BoeXNpY3MKUGh5c2lvbG9neQ1QaHlzaW90aGVyYXB5BlBvbGlzaBFQb2xpdGljYWwgU2NpZW5jZRFQb3B1bGF0aW9uIEhlYWx0aDBQb3B1bGF0aW9uIEhlYWx0aCBSaXNrIEFzc2Vzc21lbnQgYW5kIE1hbmFnZW1lbnQKUG9ydHVndWVzZRZQcmUtaW50ZXJuc2hpcCBQcm9ncmFtClBzeWNob2xvZ3kVUHVibGljIEFkbWluaXN0cmF0aW9uIFB1YmxpYyBhbmQgSW50ZXJuYXRpb25hbCBBZmZhaXJzDVB1YmxpYyBFdGhpY3MOUmVoYWJpbGl0YXRpb24RUmVsaWdpb3VzIFN0dWRpZXMcUnVzc2lhbiBMYW5ndWFnZSBhbmQgQ3VsdHVyZQdTY2llbmNlG1NjaWVuY2UsIFNvY2lldHkgYW5kIFBvbGljeRhTZWNvbmQtTGFuZ3VhZ2UgVGVhY2hpbmcPU29jaWFsIFNjaWVuY2VzFVNvY2lhbCBTY2llbmNlcyBDTy1PUBlTb2NpYWwgU2NpZW5jZXMgb2YgSGVhbHRoC1NvY2lhbCBXb3JrCVNvY2lvbG9neRRTb2Z0d2FyZSBFbmdpbmVlcmluZwdTcGFuaXNoGVNwZWVjaC1MYW5ndWFnZSBQYXRob2xvZ3kPU3lzdGVtcyBTY2llbmNlB1RoZWF0cmUIVGhlb2xvZ3kLVHJhbnNsYXRpb24kVHJhbnNsYXRpb25hbCBhbmQgTW9sZWN1bGFyIE1lZGljaW5lIFVuaXZlcnNhbCBUaGVzaXMgQ29kZSAtIE1hc3RlcidzG1VuaXZlcnNhbCBUaGVzaXMgQ29kZSAtIFBoRAtWaXN1YWwgQXJ0cw9Xb21lbidzIFN0dWRpZXMeV29ybGQgTGl0ZXJhdHVyZXMgYW5kIEN1bHR1cmVzB1lpZGRpc2gVmQEAA0VBUwNDUFQDQ09QA0FETQNBTlADQU5UA0FSQgNBQ1ADQU1UA0FTSQNCSUwDQkNIA0JORgNCSU8DQk1HA0JJTQNCUFMDQkNHA0NETgNDTU0DQ0xUA1RPWANDSEcDQ0hNA0NITgNDVkcDRFJDA0NMQQNMQ0wDQ0xJA0NNTANJU0MDQ01OA1NTQwNDUEwDQ0VHA0NTSQNFQ1MDRUNIA0NSTQNYU1ADU0RTA0RITgNBRFIDRUNPA0VEVQNQRFADUEVEA0VMRQNFTEcDRUJDA0dORwNFTVADRU5HA0VTTANFVkcDRVZTA0VOVgNFVkQDRVBJA0VGUgNBRFgDQ0lOA01GRQNGUkUDRkxTA0NHSQNHRUcDR0VPA0FMRwNHUlQDSUdMA01IQQNIU1MDTUhTA0hJUwNITUcDQVBBA0hUUANJTEEDSVNJA0lUSQNBSEwDRFZNA1NBSQNJVEEDSlBOA0pPVQNFTEEDRENMA0RDQwNMU1IDRlJBA0xJTgNNQkEDTUdUA01BVANNQ0cDSU5SA01FRANNRFYDTUlDA01JUwNMTE0DTVVTA05TQwNOU0cDTlVUA0VSRwNPTVQDSVBBA1BNRQNQSEEDUEhJA1BIWQNQSFMDUEhUA1BMTgNQT0wDUE9QA1BIUgNQT1IDUElQA1BTWQNQQVADQVBJA0VQRQNSRUEDU1JTA1JVUwNTQ0kDSVNQA0RMUwNTQ1MDRlNTA1NTUwNTVlMDU09DA1NFRwNFU1ADT1JBA1NZUwNUSEUDVEhPA1RSQQNUTU0DVEhNA1RIRANBUlQDRkVNA0xDTQNZREQUKwOZAWdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2RkAmkPEGQQFQ4DQWxsCUNpdmlsIExhdwpDb21tb24gTGF3FENvbnRpbnVpbmcgRWR1Y2F0aW9uFENvbnRpbnVpbmcgRWR1Y2F0aW9uD0ZhY3VsdHkgb2YgQXJ0cxRGYWN1bHR5IG9mIEVkdWNhdGlvbhZGYWN1bHR5IG9mIEVuZ2luZWVyaW5nGkZhY3VsdHkgb2YgSGVhbHRoIFNjaWVuY2VzE0ZhY3VsdHkgb2YgTWVkaWNpbmUSRmFjdWx0eSBvZiBTY2llbmNlGkZhY3VsdHkgb2YgU29jaWFsIFNjaWVuY2VzG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudBRWaWNlIFJlY3RvciBBY2FkZW1pYxUOAAREQ0lWBENMQVcFRURVUEUFRURVUEUEQVJUUwNFRFUFR0VOSUUEU1NBTgNNRUQFU0NJRU4EU1NPQwRHRVNUA1ZSRRQrAw5nZ2dnZ2dnZ2dnZ2dnZ2RkAm8PEGQQFaoBA0FsbApBUiBSb3NhcmlvCUFUIEJ1bmRlcwlBVSBTeWRuZXkLQVUgVmljdG9yaWEIQmFyYmFkb3MLQkUgQnJ1c3NlbHMTQkUgTG91dmFpbi1sYS1OZXV2ZQtCVyBHYWJvcm9uZQpDQSBBbG1vbnRlDUNBIEFudGlnb25pc2gLQ0EgQXJucHJpb3IJQ0EgQmFycmllDkNBIEJhcnJ5J3MgQmF5DUNBIEJlbGxldmlsbGUNQ0EgQnJvY2t2aWxsZQpDQSBDYWxnYXJ5EUNBIENhcmxldG9uIFBsYWNlGENBIFNvdXRoLUNlbnRyYWwgT250YXJpbwtDQSBDaGFwbGVhdQpDQSBDaGF0aGFtC0NBIENvY2hyYW5lC0NBIENvcm53YWxsDUNBIERlZXAgUml2ZXILQ0EgRWRtb250b24OQ0EgRWxsaW90IExha2USQ0EgRWFzdGVybiBPbnRhcmlvDkNBIEZyZWRlcmljdG9uDkNBIEdyYXZlbGJvdXJnCUNBIEd1ZWxwaApDQSBIYWxpZmF4C0NBIEhhbWlsdG9uDUNBIEhhd2tlc2J1cnkJQ0EgSGVhcnN0DUNBIEhvcm5lcGF5bmUHQ0EgSHVsbAxDQSBLYWhuYXdha2UOQ0EgS2FwdXNrYXNpbmcLQ0EgS2lsbGFsb2ULQ0EgS2luZ3N0b24QQ0EgS2lya2xhbmQgTGFrZQ5DQSBMZW5ub3h2aWxsZQ1DQSBMZXRoYnJpZGdlCUNBIExvbmRvbh5DQSBMb25kb24gLSBXZXN0ZXJuIFVuaXZlcnNpdHkPQ0EgTWFuaXRvdXdhZGdlC0NBIE1hbml3YWtpDkNBIE1pc3Npc3NhdWdhDUNBIE1pc3Rpc3NpbmkKQ0EgTW9uY3RvbgtDQSBNb250cmVhbA9DQSBOZXcgTGlza2VhcmQMQ0EgTm9lbHZpbGxlE0NBIE5vcnRoZXJuIE9udGFyaW8MQ0EgTm9ydGggQmF5C0NBIE9ha3ZpbGxlCkNBIE9wZW9uZ28JQ0EgT3NoYXdhCUNBIE90dGF3YRtDQSBPdHRhd2EgRG9taW5pY2FuIENvbGxlZ2UeQ0EgT3R0YXdhIExhIENpdMOpIGNvbGzDqWdpYWxlHUNBIE90dGF3YSBDYXJsZXRvbiBVbml2ZXJzaXR5HENBIE90dGF3YSBTdC1QYXVsIFVuaXZlcnNpdHkJQ0EgT3hmb3JkHUNBIFBlbWJyb2tlIEFsZ29ucXVpbiBDb2xsZWdlEkNBIFBlbmV0YW5ndWlzaGVuZQhDQSBQZXJ0aAtDQSBQZXRhd2F3YQ9DQSBQZXRlcmJvcm91Z2gOQ0EgUGxhbnRhZ2VuZXQQQ0EgUHJpbmNlIEFsYmVydBVDQSBQcm92aW5jZSBvZiBRdWViZWMJQ0EgUXVlYmVjCUNBIFJlZ2luYQpDQSBSZW5mcmV3CUNBIFJpZ2F1ZBBDQSBTYWludC1Jc2lkb3JlCUNBIFNhcm5pYQxDQSBTYXNrYXRvb24TQ0EgU2F1bHQgU3RlLiBNYXJpZQ1DQSBTZXB0LcOObGVzD0NBIFNtaXRocyBGYWxscxFDQSBTdHVyZ2VvbiBGYWxscwpDQSBTdWRidXJ5DUNBIFN1bm55YnJvb2sJQ0EgU3lkbmV5CkNBIFRpbW1pbnMKQ0EgVG9yb250bwxDQSBWYW5jb3V2ZXILQ0EgVmljdG9yaWELQ0EgV2F0ZXJsb28KQ0EgV2VsbGFuZAlDQSBXaWxjb3gNQ0EgV2luY2hlc3RlcgpDQSBXaW5kc29yC0NBIFdpbm5pcGVnHkNBIFdvb2Ryb2ZmZSBBbGdvbnF1aW4gQ29sbGVnZQ5DQSBZZWxsb3drbmlmZQZDYW5hZGELQ0wgU2FudGlhZ28dU3Rvcm1vbnQsIER1bmRhcywgR2xlbmcuIENudHkMQ04gSG9uZyBLb25nGVByZXNjb3R0IC0gUnVzc2VsbCBDb3VudHkOUmVuZnJldyBDb3VudHkKQ29udmVyc2lvbhZERSBCYWRlbiAtIFfDvHR0ZW5iZXJnDERFIFBhZGVyYm9ybglESyBBYXJodXMNREsgQ29wZW5oYWdlbghFQyBRdWl0bwVFZ3lwdAxFUyBCYXJjZWxvbmEKRVMgR3JhbmFkYQlFUyBNYWRyaWQNRVMgVmFsbGFkb2xpZAVTcGFpbgZFdXJvcGUJRlIgQW1pZW5zCEZSIEFycmFzCEZSIEFzdG9uB0ZSIENhZW4RRlIgQ2VyZ3ktUG9udG9pc2UNRlIgQ29tcGnDqGduZQtGUiBHcmVub2JsZQdGUiBMeW9uHkZSIEx5b24gLSBFTUxZT04gQnVzaW5lc3MgU2NoLg1GUiBNYXJzZWlsbGVzB0ZSIE1ldHoJRlIgTmFudGVzCEZSIFBhcmlzC0ZSIFBvaXRpZXJzCEZSIFJlaW1zCUZSIFJlbm5lcxJGUiBSaMO0bmVzIC0gQWxwZXMIRlIgUm91ZW4eRlIgU2FpbnQtQmVydHJhbmQtZGUtQ29tbWluZ2VzBkZyYW5jZQ1HQiBCaXJtaW5naGFtDUdCIENhbnRlcmJ1cnkNR0IgTm90dGluZ2hhbQ1HcmVhdCBCcml0YWluCklUIEJvbG9nbmEIS1IgU2VvdWwGTGF0dmlhC01YIE1leGljYWxpDk1YIE1leGljbyBDaXR5GU1YIFNhbnRpYWdvIGRlIFF1ZXLDqXRhcm8NTVggVGFtYXVsaXBhcwxOTCBBbXN0ZXJkYW0MTkwgVGhlIEhhZ3VlDU5MIE1hYXN0cmljaHQJTk8gQmVyZ2VuDU5vcnRoIEFtZXJpY2EJUG9ydHVndWFsClNFIFVwcHNhbGEIU0UgVmF4am8GU3dlZGVuClRIIEJhbmdrb2sQVEggQ2h1bGFsb25na29ybghUTiBUdW5pcwlUUiBBbmthcmEOVVMgQWxidXF1ZXJxdWUNVVMgQ2luY2lubmF0aQtVUyBDbGFya3NvbgxVUyBDbGV2ZWxhbmQNVVMgV2FzaGluZ3RvbgdWaXJ0dWFsCFpaIE90aGVyC1paIEV4dGVyaW9yC1paIE92ZXJzZWFzFaoBAAdBUlJPU0FSB0FUQlVOREUHQVVTWUROWQdBVVZJQ1RPB0JCUEFZUzAHQkVCUlVYRQdCRUxPVVZBB0JXR0FCT1IHQ0FBTE1PTgdDQUFOVElHB0NBQVJOUFIHQ0FCQVJSSQdDQUJBUlJZB0NBQkVMTEUHQ0FCUk9DSwdDQUNBTEdBB0NBQ0FSUEwHQ0FDU1VPTgdDQUNIQVBMB0NBQ0hBVEgHQ0FDT0NIUgdDQUNPUk5XB0NBREVFUFIHQ0FFRE1PTgdDQUVMQUtFB0NBRVNUT04HQ0FGUkVEVAdDQUdSQVZFB0NBR1VFTFAHQ0FIQUxJRgdDQUhBTUlMB0NBSEFXS0UHQ0FIRUFSUwdDQUhPUk5FBkNBSFVMTAdDQUtBSE5BB0NBS0FQVVMHQ0FLSUxMQQdDQUtJTkdTB0NBS0lSS0wHQ0FMRU5OWAdDQUxFVEhCB0NBTE9ORE8KQ0FMT05ET1dTVAdDQU1BTklUB0NBTUFOSVcHQ0FNSVNTSQdDQU1JU1RJB0NBTU9OQ1QHQ0FNT05UUgdDQU5MSVNLB0NBTk9FTFYHQ0FOT1JPTgdDQU5PQkFZB0NBT0FLVkkHQ0FPUEVPTgdDQU9TSEFXB0NBT1RUQVcKQ0FPVFRBV0RPTQpDQU9UVEFXTENDCkNBT1RUQVdDQVIKQ0FPVFRBV1NQQQdDQU9YRk9SCkNBUEVNQlJBTEcHQ0FQRU5FVAdDQVBFUlRIB0NBUEVUQVcHQ0FQRVRFUgdDQVBMQU5UB0NBUFJBTEIHUUNQUk9WQwdDQVFVRUJDB0NBUkVHSU4HQ0FSRU5GUgdDQVJJR0FVB0NBU0lTSUQHQ0FTQVJOSQdDQVNBU0tBB0NBU0FVTFQHQ0FTRVBUSQdDQVNGQUxMB0NBU1RVUkYHQ0FTVURCVQdDQVNVTk5ZB0NBU1lETlkHQ0FUSU1NSQdDQVRPUk9OB0NBVkFOQ08HQ0FWSUNUTwdDQVdBVEVSB0NBV0VMTEEHQ0FXSUxDTwdDQVdJTkNIB0NBV0lORFMHQ0FXSU5OSQpDQVdPT0RSQUxHB0NBWUVMTE8HQ0FQQVlTMAdDTFNBTlRHB1NEQ09NVEUHQ05IT05HSwdQUkNPTVRFB1JGQ09NVEUEQ09OVgdERVdVVFRFB0RFUEFERVIHREtBQVJIVQdES0NPUEVOB0VDUVVJVE8HRUdQQVlTMAdFU0JBUkNFB0VTR1JBTkEHRVNNQURSSQdFU1ZBTERPB0VTUEFZUzAHRVVDTlROVAdGUkFNSUVOB0ZSQVJSQVMHRlJBU1RPTgdGUkNBRU4wB0ZSQ0VSR1kHRlJDT01QSQdGUkdSRU5PB0ZSTFlPTjAJRlJMWU9ORU1MB0ZSTUFSU0UHRlJNRVRaMAdGUk5BTlRFB0ZSUEFSSVMHRlJQT0lUSQdGUlJFSU1TB0ZSUkVOTkUHRlJSSE9ORQdGUlJPVUVOB0ZSU0JFUlQHRlJQQVlTMAdHQkJJUk1JB0dCQ0FOVFIHR0JOT1RUSQdHQlBBWVMwB0lUQk9MT0cHS1JTRU9VTAdMVlBBWVMwB01YTUVYSUwHTVhNRVhJQwdNWFFVRVJFB01YVEFNQVUHTkxBTVNURQdOTEhBR1VFB05MTUFBU1QHTk9CRVJHRQdOQUNOVE5UB1BUUEFZUzAHU0VVUFBTTAdTRVZBWEpPB1NFUEFZUzAHVEhCQU5HSwdUSENIVUxBB1ROVFVOSVMHVFJBTktBUgdVU0FMQlVRB1VTQ0lOQ0kHVVNDTEFSSwdVU0NMRVZFB1VTV0FTSEkHWlpWSVJUTAdaWk9USEVSB1paRVhURVIHWlpPVU1FUhQrA6oBZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAKBAQ8QZBAVIANBbGwFMDc6MDAFMDc6MzAFMDg6MDAFMDg6MzAFMDk6MDAFMDk6MzAFMTA6MDAFMTA6MzAFMTE6MDAFMTE6MzAFMTI6MDAFMTI6MzAFMTM6MDAFMTM6MzAFMTQ6MDAFMTQ6MzAFMTU6MDAFMTU6MzAFMTY6MDAFMTY6MzAFMTc6MDAFMTc6MzAFMTg6MDAFMTg6MzAFMTk6MDAFMTk6MzAFMjA6MDAFMjA6MzAFMjE6MDAFMjE6MzAFMjI6MDAVIAAIMDc6MDA6MDAIMDc6MzA6MDAIMDg6MDA6MDAIMDg6MzA6MDAIMDk6MDA6MDAIMDk6MzA6MDAIMTA6MDA6MDAIMTA6MzA6MDAIMTE6MDA6MDAIMTE6MzA6MDAIMTI6MDA6MDAIMTI6MzA6MDAIMTM6MDA6MDAIMTM6MzA6MDAIMTQ6MDA6MDAIMTQ6MzA6MDAIMTU6MDA6MDAIMTU6MzA6MDAIMTY6MDA6MDAIMTY6MzA6MDAIMTc6MDA6MDAIMTc6MzA6MDAIMTg6MDA6MDAIMTg6MzA6MDAIMTk6MDA6MDAIMTk6MzA6MDAIMjA6MDA6MDAIMjA6MzA6MDAIMjE6MDA6MDAIMjE6MzA6MDAIMjI6MDA6MDAUKwMgZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAKFAQ8QZBAVIANBbGwFMDg6MDAFMDg6MzAFMDk6MDAFMDk6MzAFMTA6MDAFMTA6MzAFMTE6MDAFMTE6MzAFMTI6MDAFMTI6MzAFMTM6MDAFMTM6MzAFMTQ6MDAFMTQ6MzAFMTU6MDAFMTU6MzAFMTY6MDAFMTY6MzAFMTc6MDAFMTc6MzAFMTg6MDAFMTg6MzAFMTk6MDAFMTk6MzAFMjA6MDAFMjA6MzAFMjE6MDAFMjE6MzAFMjI6MDAFMjI6MzAFMjM6MDAVIAAIMDg6MDA6MDAIMDg6MzA6MDAIMDk6MDA6MDAIMDk6MzA6MDAIMTA6MDA6MDAIMTA6MzA6MDAIMTE6MDA6MDAIMTE6MzA6MDAIMTI6MDA6MDAIMTI6MzA6MDAIMTM6MDA6MDAIMTM6MzA6MDAIMTQ6MDA6MDAIMTQ6MzA6MDAIMTU6MDA6MDAIMTU6MzA6MDAIMTY6MDA6MDAIMTY6MzA6MDAIMTc6MDA6MDAIMTc6MzA6MDAIMTg6MDA6MDAIMTg6MzA6MDAIMTk6MDA6MDAIMTk6MzA6MDAIMjA6MDA6MDAIMjA6MzA6MDAIMjE6MDA6MDAIMjE6MzA6MDAIMjI6MDA6MDAIMjI6MzA6MDAIMjM6MDA6MDAUKwMgZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WCQU1Y3RsMDAkTWFpbkNvbnRlbnRQbGFjZUhvbGRlciRBZHZhbmNlX0RheXNDaGVja2JveGVzJDAFNWN0bDAwJE1haW5Db250ZW50UGxhY2VIb2xkZXIkQWR2YW5jZV9EYXlzQ2hlY2tib3hlcyQxBTVjdGwwMCRNYWluQ29udGVudFBsYWNlSG9sZGVyJEFkdmFuY2VfRGF5c0NoZWNrYm94ZXMkMgU1Y3RsMDAkTWFpbkNvbnRlbnRQbGFjZUhvbGRlciRBZHZhbmNlX0RheXNDaGVja2JveGVzJDMFNWN0bDAwJE1haW5Db250ZW50UGxhY2VIb2xkZXIkQWR2YW5jZV9EYXlzQ2hlY2tib3hlcyQ0BTVjdGwwMCRNYWluQ29udGVudFBsYWNlSG9sZGVyJEFkdmFuY2VfRGF5c0NoZWNrYm94ZXMkNQU1Y3RsMDAkTWFpbkNvbnRlbnRQbGFjZUhvbGRlciRBZHZhbmNlX0RheXNDaGVja2JveGVzJDYFNWN0bDAwJE1haW5Db250ZW50UGxhY2VIb2xkZXIkQWR2YW5jZV9EYXlzQ2hlY2tib3hlcyQ2BS1jdGwwMCRNYWluQ29udGVudFBsYWNlSG9sZGVyJEFkdmFuY2VfQXVkaXRvcnOGQ1Z38RnALtIuteRahAAZzhiglg%3D%3D&__VIEWSTATEGENERATOR=1887B42F&__EVENTVALIDATION=%2FwEWyQQC9Mv5jwwCnNPj9wcCzLeFrAwC956H4AcC6IfijQwC%2F%2B6KsQsC4ZysmQ0Cx%2BrfnAcCosP5ggkCtqaO3wYC2Y6%2BwwICuKaK3wYCpMOxggkC3rzD3Q8CuKa%2B3wYCpMONggkCrfHynAoC%2FbWM3AgC0Zit6QECy9magAYCjPjVnQkCpLL0twgC1o6SwwICyOqbnwcCpLLstwgCsOeD9gQC146CwwICosOJggkC7%2B2fhQcCpbLAtwgC147uwwICsOfz9gQCpbLYtwgCtpWhwwECw6uFtgUCw7XU3QgCq%2FGWnAoC%2BrW83AgCg5WlwwECsOfn9gQCiZWlwwEC%2BrXo3AgCpbKUtwgCq%2FHynAoCx%2BrHnAcCzJit6QEC1472wwICk6b%2B3wYC2erLnAcCsefz9gQC7pHm6QICi%2Fj9nQkCvdSPqQMCi6ai3wYC5%2B%2Fy9wsC7cCMnQwCo7LwtwgCt5XhwAECobL4twgCtKaG3wYCo7L4twgC%2BLWU3AgCo7LYtwgCx%2BqznwcClq313AUCkO629gsCqfHGnAoC6pHu6QIC4O2zhQcCsOf39gQC9cDUmgwC6sDknQwCxOqrnwcCq%2FGinAoCobKUtwgCifjlnQkCp7LwtwgC3sPhggkCxLXE3QgCyauVtgUC0uqHnwcCz%2Bq7nwcC0uq%2FnwcCrrL0twgCxav1tgUCg6bi3wYCzauFtgUCtfHynAoCtfH2nAoC%2FLWI3AgC1I7mwwICu%2FGKnAoCzavltgUCu%2BfT9gQChtSbqQMCwauFtgUC%2B7XU3QgCtpXlwAEC9ZGi6AIC%2Fqv9tgUCuef39gQCyau9tgUCqMPVgwkCqMO9ggkCq7LstwgC9pHO6QICmO7y9wsCnq3t3AUCv5XdwAECz%2Bq%2FnwcC3I6ewwICz%2BqPnwcCvJWlwwECqLKstggCqcPtggkCo7KotggCpsONggkCzav1tgUCwMCwnQwC1KuVtgUCvPHmnAoCzMbBqAkC2uq7nwcCt8OZggkChefj9gQCz7Wk3AgCi6aO3wYCwZHW6QICwZHy6QICi6aW3wYCzMatqwkCi6a23wYCrfHGnAoC7cD8nQwC0quptgUC2eqDnwcC2OqPnwcCu%2FGynAoCgKb%2B3wYCxuqrnwcC2erHnAcCxOqHnwcC2eqHnwcC2eqznwcCiZX1wAECtbKUtwgCtKb%2B3wYCx6v9tgUC2er%2FnwcC%2FMCcnQwCmvjRnQkC0Kv9tgUCpI6CwwICpI7uwwIC4%2B%2B%2B9gsCpMPhggkC0o6iwwIC3I66wwIC7O%2FO9wsCxb3pkQICstK5wAECjO%2BZxw4C%2Bo7d0wcCgrn8uQIC0t2a4gkC6fSYrgIC49LwrwkC7L3awQUC7b3awQUC7r3awQUC773awQUCv73awQUCzpHPxgkCrOCtsQQC1oOWswcC8PXltg0CldzDqAMCgbm09QwC7pGE6QgCj7mw9QwCk9yLqAMC6aP59wUCj7mE9QwCk9y3qAMCmu7INgLKqrb2AgLmh5fDCwL8xqCqDAK75%2B%2B3AwKTrc6dAgLhkajpCAL%2F9aG1DQKTrdadAgKH%2BLncDgLgkbjpCAKV3LOoAwLY8qWvDQKSrfqdAgLgkdTpCAKH%2BMncDgKSreKdAgKBipvpCwL0tL%2BcDwL0qu73AgKc7qw2As2qhvYCArSKn%2BkLAof43dwOAr6Kn%2BkLAs2q0vYCApKtrp0CApzuyDYC8PX9tg0C%2B4eXwwsC4JHM6QgCpLnE9QwC7vXxtg0ChvjJ3A4C2Y7cwwgCvOfHtwMCisu1gwkCvLmY9QwC0PDI3QEC2t%2B2twYClK3KnQICgIrb6gsClq3CnQICg7m89QwClK3CnQICz6qu9gIClK3inQIC8PWJtQ0CobLP9g8Cp%2FGM3AECnu78NgLdjtTDCALX8omvDQKH%2BM3cDgLC3%2B6wBgLd3963BgLz9ZG1DQKc7pg2Apatrp0CAr7n37cDApCtyp0CAunc26gDAvOq%2FvcCAv60r5wPAuX1vbUNAvj1gbUNAuX1hbUNApmtzp0CAvK0z5wPArS52PUMAvq0v5wPAoLuyDYCgu7MNgLLqrL2AgLjkdzpCAKM7rA2Avq035wPAoz46dwOArHLoYMJAva0v5wPAsyq7vcCAoGK3%2BoLAsKOmMIIAsm0x5wPAo74zdwOAv60h5wPAp%2Fc76kDAp%2Fch6gDApyt1p0CAsGO9MMIAq%2FxyN0BAqmy1%2FYPAoiK5%2BoLAvj1hbUNAuuRpOkIAvj1tbUNAouKn%2BkLAp%2BtlpwCAp7c16gDApStkpwCApHct6gDAvq0z5wPAvffircGAuO0r5wPAovu3DYC%2B9n7ggMC7fWBtQ0CgNyjqAMCsvjZ3A4C%2BKqe9gICvLm09QwC9o7swwgC9o7IwwgCvLms9QwC%2B9mXgQMCvLmM9QwCmu78NgLa38a3BgLltJOcDwLu9bm1DQLv9bW1DQKM7og2Are5xPUMAvH1kbUNAu71%2FbYNAvP1vbUNAu71vbUNAu71ibUNAr6Kz%2BoLAoKtrp0CAoO5xPUMAvC0x5wPAu71xbUNAsvfprcGAq3n67cDAue0x5wPApORuOkIApOR1OkIAtTwhNwBApPc26gDAuWRmOkIAuuRgOkIAtvw9N0BAvuO0CwCsuO28gsC2bmNgQQCrM%2FuvAMCrM%2FuvAMCvtGBqgMCp8bznA4C%2B%2F3CNgLJuaWDBwKC%2FI7CBgLx5MXABAKH6oWRBwLf%2BIM5AuDSmKgBAq%2FamLoNAsPkmYQFAueEmLYNAtit78QJAuiMhYUKAtyrt4oGAouHkIQDAoH4u98NAuKUu8IFAt7T38APAtqMgoEFAvX06uoLAu2R4sQCAt2Ez%2BgPAqOH1MUKAqrEhtYBApLlzN0EApmXresBAtzFhcQEAuaX8agFApqoyN0NAu7Uh8EEAobamqsKAvmE5vkDAqragfgOAuPF4JQFAtOl9L4GAsHK76cLArX%2BhMsFAtKh4%2F4DAuqR1LEDAouOgbYMAqLdtvEBAuamqc0DAqfd0vEGAs6ml7cLAs7l77sDAvCkseICAsrll7kHAsakieAGAoHgw6MHAt6Bye8IApK88ZIIArW7sfoPAti83vsPAvevk%2FALAqjgqrAFAtmgw44PAtmg344PAvevw%2FAIAqGS284EAriErc0OAuO51ZoIAvLD%2B8wOArnFy9oOAouTviQCwPP%2FzwYCsNC88AkCtNCIsAgCj9eVkQ0Cg9ft6wcChdf12QkCttfhrw0C95Tm8Q0Cq8C00w4C3tCyxggCrpnangwC%2F%2FuE3QYC5snvxgUC19DShwwCqf2sqQ8Cxs%2FamAECxeiZ5w4C%2Ba%2Fh7wsCnufZlwYCnPW4%2Fw8CgN6Z5AIC%2BNO9%2FA4Cr5rapg8CqqvvsgwC9tO1%2FwgCtpTH%2FwoCxIyU8wwC1t2azA0CnKyvzgcCkqy%2FzAkCuLbUlA4C5NGUowIC046ZjwYCro%2FVjwoCvfK%2FwQYC1qWmtA8C7Pe%2F3AoClcWKxgkC0uS1XQKw7NDcBwK898TrBwKy1MmlCgL7q7OLBgL6t55OAs3EzbENArWc4B8ClMXlmA0CrvrVtw0C%2FqGT8wMCk%2F%2F%2B2w8Cl87PwwsCl%2BfLxQ0C4vrluA0Cz%2Fu%2FbwK9qJudBgLvh%2BC0CwLDpZSRDQLmof%2F4CwKTj935BgK9qMv6BgL9zdD%2BAQK305fwDgL%2FnszxAQLS0qfxAwKrndjTCwL7wYzOAgKW0uubBwKg9t27AQLi6uWmBAKxsLzrDgLRxO%2BiAgLc1%2FKeDAK0vN79BALUoYCYDAL98YzxBQLZ%2F%2B%2FrCALQm72cBgLRm7HSCQL0rt3cDgKHqo%2FjDALQqvf7BgKRkLrFBgLv19vDBwL%2F0L6xDALPqreKBgK76ciOBAKEiousCgLGqceHBgK7mM6zBwKor%2FryCAL99tDLDQLWtp3LBwLm8OqdAQKX0qr3AQKtrefxCwKMhPDHCgKewuCBAQLKrM%2BBBgKBjdqaCwK1g82KBgKrrIOXBgLY%2B%2BaUCQLsmdCUCALmmuGwBALn6JrlAQLkxpTOCALK14ObCgKxusYxAofF1dgDAqnh8MkDAvf6yLcEAriMktgLAtavsucCArWM7psKAo7Z5YUBAsbjjtQBAsfjjtQBAsTjjtQBAsXjjtQBAsrjjtQBAsvjjtQBAsjjjtQBAo2ajNMIAoH1qb0MAoH15TACgfXtrQwCgfWpJwKB9eGoDAKB9b0iAqb1jaQMAqb1yT8CpvWBpwwCpvXdOgKm9YWmDAKm9cE5Aqb1%2BaIMAqb1tTQCpvX9oQwCpvW5OwKm9fG8DAKm9c02Aqb19aMMAqb1sTUCpvWpvQwCpvXlMAKm9e2tDAKm9aknAqb14agMAqb1vSICx%2FSNpAwCx%2FTJPwLH9IGnDALH9N06Asf0haYMAuK8g8cPAu7T4rkLAu7TprMHAu7T7rwLAu7TsrYHAsnTgrALAsnTxqsHAsnTjrMLAsnT0q4HAsnTirILAsnTzq0HAsnT9rYLAsnTuqAHAsnT8rULAsnTtq8HAsnT%2FqgLAsnTwqIHAsnT%2BrcLAsnTvqEHAsnTpqkLAsnT6qQHAsnT4rkLAsnTprMHAsnT7rwLAsnTsrYHAqjSgrALAqjSxqsHAqjSjrMLAqjS0q4HAqjSirILAqjSzq0HAqjS9rYLAqqC48gPAo%2Fo68UPVia8XcggKU6xSRycX%2FKuFyhwBF4%3D&q=&ie=iso-8859-1&ctl00%24MainContentPlaceHolder%24Basic_TermDropDown=&ctl00%24MainContentPlaceHolder%24Basic_SubjectText=&ctl00%24MainContentPlaceHolder%24Basic_CatalogNumberText=&ctl00%24MainContentPlaceHolder%24Basic_SubjectDropDown=MAT&ctl00%24MainContentPlaceHolder%24Basic_Button=Search&ctl00%24MainContentPlaceHolder%24Advance_CampusChoice=UOTTA&ctl00%24MainContentPlaceHolder%24Advance_TermDropDown=&ctl00%24MainContentPlaceHolder%24Advance_YearOfStudy=&ctl00%24MainContentPlaceHolder%24Advance_SubjectText=&ctl00%24MainContentPlaceHolder%24Advance_CatalogNumberText=&ctl00%24MainContentPlaceHolder%24Advance_SubjectDropDown=&ctl00%24MainContentPlaceHolder%24Advance_FacultyDropDown=&ctl00%24MainContentPlaceHolder%24Advance_OffCampusLocation=&ctl00%24MainContentPlaceHolder%24Advance_KeywordText=&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%240=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%241=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%242=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%243=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%244=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%245=on&ctl00%24MainContentPlaceHolder%24Advance_DaysCheckboxes%246=on&ctl00%24MainContentPlaceHolder%24Advance_FromTime=&ctl00%24MainContentPlaceHolder%24Advance_ToTime="
	form = dict(urllib.parse.parse_qsl(s, keep_blank_values = True))

	soup = BeautifulSoup(requests.get(timetable_url).text, 'html.parser')
	update = {key:soup.find('input', attrs={'name':key}) for key in form}
	for key in update:
		if '__' in key and update[key] is not None and 'value' in update[key]:
			#print("Updating:", key)
			form[key] = update[key]['value']

	return form

def get_form2():
	'''
	Returns the dictionary to be used when you must click 'Next' to see more entries in the timetable
	Used in get_schedules.ipynb
	'''
	s = '__EVENTTARGET=ctl00%24MainContentPlaceHolder%24ctl03&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKMTI5NTkyMDU1Mg9kFgJmD2QWBgIFDxYCHgRUZXh0ZGQCCg8WAh8ABQJlbmQCDQ9kFgYCAw8PFgIfAAUJRnJhbsOnYWlzFgYeA3JlbAUJYWx0ZXJuYXRlHgRsYW5nBQVmci1DQR4IaHJlZmxhbmcFBWZyLUNBZAIIDxYCHwAFB3NwYW4tMThkAgkPZBYKAgMPFgIfAAUENTc0MmQCBQ8WAh8ABSwgY291cnNlcyBjb3JyZXNwb25kIHRvIHlvdXIgc2VhcmNoIGNyaXRlcmlhLmQCBw8WAh4HVmlzaWJsZWdkAgsPFCsADQ8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudAIUFgIeB1N1bW1hcnkFJENvdXJzZXMgdGhhdCBtYXRjaGVzIHNlYXJjaCBjcml0ZXJpYQ8UKwAFFCsABRYEHglEYXRhRmllbGQFCnRlcm1OYW1lRW4eCkhlYWRlclRleHQFBFRlcm0WBB4IQ3NzQ2xhc3MFBFRlcm0eBF8hU0ICAmRkZBQrAAUWCh4NRGF0YVRleHRGaWVsZAUKY291cnNlQ29kZR8JBQtDb3Vyc2UgQ29kZR4VRGF0YU5hdmlnYXRlVXJsRmllbGRzFQMIY291cnNlSWQEdGVybQdzZXNzaW9uHhtEYXRhTmF2aWdhdGVVcmxGb3JtYXRTdHJpbmcFJ0NvdXJzZS5hc3B4P2lkPXswfSZ0ZXJtPXsxfSZzZXNzaW9uPXsyfR4GVGFyZ2V0BQZfYmxhbmsWBB8KBQpDb3Vyc2VDb2RlHwsCAmRkZBQrAAUWBB8IBQ1jb3Vyc2VUaXRsZUVuHwkFDENvdXJzZSBUaXRsZRYEHwoFC0NvdXJzZVRpdGxlHwsCAmRkZBQrAAUWBB8IBQlmYWN1bHR5RW4fCQUHRmFjdWx0eRYEHwoFB0ZhY3VsdHkfCwICZGRkFCsABRYEHwgFDGRlcGFydG1lbnRFbh8JBQpEZXBhcnRtZW50FgQfCgUKRGVwYXJ0bWVudB8LAgJkZGQUKwEFZgIEZmZmZBYEHwoFDnJlc3VsdHMtaGVhZGVyHwsCAmRkFgQfCgUKcmVzdWx0LW9kZB8LAgJkZGRkZGQWAmYPZBYqAgEPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMTYeC05hdmlnYXRlVXJsBSpDb3Vyc2UuYXNweD9pZD0wMzkzNTImdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABRhDb21wZXRpdGl2ZSBJbnRlbGxpZ2VuY2VkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAICD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzE4HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4MyZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFFkludGVybmF0aW9uYWwgQnVzaW5lc3NkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIDD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzE5HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4NCZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFGUNyb3NzLUN1bHR1cmFsIE1hbmFnZW1lbnRkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIED2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzIxHxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4NSZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFEkNvbnN1bWVyIEJlaGF2aW91cmRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAgUPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMjIfEAUqQ291cnNlLmFzcHg%__EVENTTARGET=ctl00%24MainContentPlaceHolder%24ctl03&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKMTI5NTkyMDU1Mg9kFgJmD2QWBgIFDxYCHgRUZXh0ZGQCCg8WAh8ABQJlbmQCDQ9kFgYCAw8PFgIfAAUJRnJhbsOnYWlzFgYeA3JlbAUJYWx0ZXJuYXRlHgRsYW5nBQVmci1DQR4IaHJlZmxhbmcFBWZyLUNBZAIIDxYCHwAFB3NwYW4tMThkAgkPZBYKAgMPFgIfAAUENTc0MmQCBQ8WAh8ABSwgY291cnNlcyBjb3JyZXNwb25kIHRvIHlvdXIgc2VhcmNoIGNyaXRlcmlhLmQCBw8WAh4HVmlzaWJsZWdkAgsPFCsADQ8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudAIUFgIeB1N1bW1hcnkFJENvdXJzZXMgdGhhdCBtYXRjaGVzIHNlYXJjaCBjcml0ZXJpYQ8UKwAFFCsABRYEHglEYXRhRmllbGQFCnRlcm1OYW1lRW4eCkhlYWRlclRleHQFBFRlcm0WBB4IQ3NzQ2xhc3MFBFRlcm0eBF8hU0ICAmRkZBQrAAUWCh4NRGF0YVRleHRGaWVsZAUKY291cnNlQ29kZR8JBQtDb3Vyc2UgQ29kZR4VRGF0YU5hdmlnYXRlVXJsRmllbGRzFQMIY291cnNlSWQEdGVybQdzZXNzaW9uHhtEYXRhTmF2aWdhdGVVcmxGb3JtYXRTdHJpbmcFJ0NvdXJzZS5hc3B4P2lkPXswfSZ0ZXJtPXsxfSZzZXNzaW9uPXsyfR4GVGFyZ2V0BQZfYmxhbmsWBB8KBQpDb3Vyc2VDb2RlHwsCAmRkZBQrAAUWBB8IBQ1jb3Vyc2VUaXRsZUVuHwkFDENvdXJzZSBUaXRsZRYEHwoFC0NvdXJzZVRpdGxlHwsCAmRkZBQrAAUWBB8IBQlmYWN1bHR5RW4fCQUHRmFjdWx0eRYEHwoFB0ZhY3VsdHkfCwICZGRkFCsABRYEHwgFDGRlcGFydG1lbnRFbh8JBQpEZXBhcnRtZW50FgQfCgUKRGVwYXJ0bWVudB8LAgJkZGQUKwEFZgIEZmZmZBYEHwoFDnJlc3VsdHMtaGVhZGVyHwsCAmRkFgQfCgUKcmVzdWx0LW9kZB8LAgJkZGRkZGQWAmYPZBYqAgEPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMTYeC05hdmlnYXRlVXJsBSpDb3Vyc2UuYXNweD9pZD0wMzkzNTImdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABRhDb21wZXRpdGl2ZSBJbnRlbGxpZ2VuY2VkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAICD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzE4HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4MyZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFFkludGVybmF0aW9uYWwgQnVzaW5lc3NkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIDD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzE5HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4NCZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFGUNyb3NzLUN1bHR1cmFsIE1hbmFnZW1lbnRkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIED2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzIxHxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4NSZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFEkNvbnN1bWVyIEJlaGF2aW91cmRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAgUPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMjIfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMDg2JnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUSU2VydmljZXMgTWFya2V0aW5nZGQCAw8PFgIfAAUbVGVsZmVyIFNjaG9vbCBvZiBNYW5hZ2VtZW50ZGQCBA8PFgIfAAUYQWRtaW5pc3RyYXRpb24gKEdlbmVyYWwpZGQCBg9kFgpmDw8WAh8ABQ4yMDE4IEZhbGwgVGVybWRkAgEPZBYCZg8PFgQfAAUHQURNMzMyMx8QBSpDb3Vyc2UuYXNweD9pZD0wMDAwODcmdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABQ9NYXJrZXQgUmVzZWFyY2hkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIHD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzI2HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA4OSZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFKkFkdmVydGlzaW5nIGFuZCBTYWxlcyBQcm9tb3Rpb24gTWFuYWdlbWVudGRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAggPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMzMfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMDkyJnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUWU3RhZmZpbmcgT3JnYW5pemF0aW9uc2RkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAgkPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzMzQfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMDkzJnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUUSW5kdXN0cmlhbCBSZWxhdGlvbnNkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIKD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzM3HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDA5NSZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFG0NvbXBlbnNhdGlvbiBBZG1pbmlzdHJhdGlvbmRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAgsPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzNDAfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMDk3JnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUaSW50ZXJtZWRpYXRlIEFjY291bnRpbmcgSUlkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIMD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzQ1HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDEwMSZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFClRheGF0aW9uIElkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIND2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzQ2HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDEwMiZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFD0Nvc3QgQWNjb3VudGluZ2RkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAg4PZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzNDkfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMTA1JnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUPQXVkaXRpbmcgVGhlb3J5ZGQCAw8PFgIfAAUbVGVsZmVyIFNjaG9vbCBvZiBNYW5hZ2VtZW50ZGQCBA8PFgIfAAUYQWRtaW5pc3RyYXRpb24gKEdlbmVyYWwpZGQCDw9kFgpmDw8WAh8ABQ4yMDE4IEZhbGwgVGVybWRkAgEPZBYCZg8PFgQfAAUHQURNMzM1MB8QBSpDb3Vyc2UuYXNweD9pZD0wMDAxMDYmdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABRFDb3Jwb3JhdGUgRmluYW5jZWRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAhAPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzNTEfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMTA3JnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUYRml4ZWQgSW5jb21lIEludmVzdG1lbnRzZGQCAw8PFgIfAAUbVGVsZmVyIFNjaG9vbCBvZiBNYW5hZ2VtZW50ZGQCBA8PFgIfAAUYQWRtaW5pc3RyYXRpb24gKEdlbmVyYWwpZGQCEQ9kFgpmDw8WAh8ABQ4yMDE4IEZhbGwgVGVybWRkAgEPZBYCZg8PFgQfAAUHQURNMzM1Mh8QBSpDb3Vyc2UuYXNweD9pZD0wMDAxMDgmdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABRRQb3J0Zm9saW8gTWFuYWdlbWVudGRkAgMPDxYCHwAFG1RlbGZlciBTY2hvb2wgb2YgTWFuYWdlbWVudGRkAgQPDxYCHwAFGEFkbWluaXN0cmF0aW9uIChHZW5lcmFsKWRkAhIPZBYKZg8PFgIfAAUOMjAxOCBGYWxsIFRlcm1kZAIBD2QWAmYPDxYEHwAFB0FETTMzNTgfEAUqQ291cnNlLmFzcHg%2FaWQ9MDAwMTEwJnRlcm09MjE4OSZzZXNzaW9uPUZTZGQCAg8PFgIfAAUeTXVsdGluYXRpb25hbCBCdXNpbmVzcyBGaW5hbmNlZGQCAw8PFgIfAAUbVGVsZmVyIFNjaG9vbCBvZiBNYW5hZ2VtZW50ZGQCBA8PFgIfAAUYQWRtaW5pc3RyYXRpb24gKEdlbmVyYWwpZGQCEw9kFgpmDw8WAh8ABQ4yMDE4IEZhbGwgVGVybWRkAgEPZBYCZg8PFgQfAAUHQURNMzM2MB8QBSpDb3Vyc2UuYXNweD9pZD0wMDAxMTEmdGVybT0yMTg5JnNlc3Npb249RlNkZAICDw8WAh8ABQxCdXNpbmVzcyBMYXdkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIUD2QWCmYPDxYCHwAFDjIwMTggRmFsbCBUZXJtZGQCAQ9kFgJmDw8WBB8ABQdBRE0zMzc4HxAFKkNvdXJzZS5hc3B4P2lkPTAwMDExNCZ0ZXJtPTIxODkmc2Vzc2lvbj1GU2RkAgIPDxYCHwAFMUVtZXJnaW5nIFRvcGljcyBpbiBNYW5hZ2VtZW50IEluZm9ybWF0aW9uIFN5c3RlbXNkZAIDDw8WAh8ABRtUZWxmZXIgU2Nob29sIG9mIE1hbmFnZW1lbnRkZAIEDw8WAh8ABRhBZG1pbmlzdHJhdGlvbiAoR2VuZXJhbClkZAIVDw8WAh8EaGRkAg0PFgIfBGdkGAEFMWN0bDAwJE1haW5Db250ZW50UGxhY2VIb2xkZXIkU2VhcmNoUmVzdWx0R3JpZFZpZXcPPCsACgEIAgFkWqzy0PI%2FWSTIZdZcNfTUJ448S%2Fw%3D&__VIEWSTATEGENERATOR=C9BB3BAA&__EVENTVALIDATION=%2FwEWBQLznpbEBwKL6OvFDwKL6OfFDwKL6OPFDwKL6N%2FFDximiSvPbo76AgUp2Bn4bm7QdfjK&q=&ie=iso-8859-1'   
	form = dict(urllib.parse.parse_qsl(s))
	return form

def get_offerings(subject, code = None, form = None, timetable_url = 'https://web30.uottawa.ca/v3/SITS/timetable/Search.aspx', session = None):
	'''
	Returns a list of dictionaries
	Each dictionary is an offering of a course searched for (can specify with subject, code)
	Can use a requests Session supplied to session to persist web connection over multiple calls to this function
	Used in get_schedules.ipynb
	'''
	if code is None:
		subject = subject.strip().split(' ')
		if len(subject) != 2:
			raise ValueError("Bad subject-code: " + str(subject))
		code = subject[1]
		subject = subject[0]
	if form is None:
		form = get_form()
	    
	form['ctl00$MainContentPlaceHolder$Basic_SubjectText'] = subject
	form['ctl00$MainContentPlaceHolder$Basic_CatalogNumberText'] = code

	courses_sch = get_courses_sch(timetable_url, form, session)
	courses_offers = []
	#parsing out the information from the HTML bs4 tag returned by get_courses_sch
	for row in courses_sch:
		tmp = dict()
		tmp['term'] = row.find('td', attrs={'class':'Term'}).text
		code = row.find('td', attrs={'class':'CourseCode'})
		tmp['link'] = code.find('a')
		tmp['code'] = tmp['link'].text
		tmp['link'] = tmp['link']['href']
		tmp['title'] = row.find('td', attrs={'class':'CourseTitle'}).text
		tmp['faculty'] = row.find('td', attrs={'class':'Faculty'}).text
		tmp['department'] = row.find('td', attrs={'class':'Department'}).text
		courses_offers.append(tmp)
	return courses_offers

def is_next_tag(tag):
	return tag.name == 'a' and 'next' in tag.text.lower()

def get_courses_sch(url, form, session = None):
	'''
	Returns a list of HTML bs4 tags containing table rows, each of which is a course offering (returned by POSTing form)
	Recursively follows next links
	'''
	t1 = pf()
	if session is None:
		session = requests.Session()

	r = session.post(url, data=form)
	courses = BeautifulSoup(r.text, 'html.parser')

	result = courses.find('div', attrs={'class':'result'}).text.strip().replace('\r', '').replace('\n', '').replace(' ', '').lower()
	if '0coursescorrespondtoyoursearchcriteria' in result:
		return []

	courses_sch = [x for x in courses.find_all('tr') if 'class' not in x.attrs or 'results-header' not in x.attrs['class']]
	if courses.find(is_next_tag) is None:
		return courses_sch

	form = get_form2()
	t2 = pf()
	sleep(max(1-(t2-t2), 0))

	r = session.post('https://web30.uottawa.ca/v3/SITS/timetable/SearchResults.aspx', data=form)
	return courses_sch + get_courses_sch('https://web30.uottawa.ca/v3/SITS/timetable/SearchResults.aspx', form, session)

def is_activity(tag):
	if not(tag.name == 'tr'):
		return False
	if tag.find('td') is None:
		return False
	if not tag.has_attr('class'):
		return True
	for x in tag['class']:
		if 'first' in x or 'hidden' in x:
			return False
	return True

def get_sections(shortlink):
	'''
	Parses the information/schedules for all sections from shortlink
	Returns list of list of dictionaries:
		Each sublist represents a section:
			Each dictionary represents a course component in that section
	Used in get_schedules.ipynb
	'''
	r = requests.get('https://web30.uottawa.ca/v3/SITS/timetable/'+shortlink)

	sch = BeautifulSoup(r.text, 'html.parser')
	sections_table = sch.find('div', attrs={'id':'schedule'})

	sections_table = sections_table.find_all('div', attrs={'id':re.compile('[0-9]{1,}'), 'class':'schedule'})

	sections = []
	for section in sections_table:
		activities = []
		section = raze_list([list(x.find_all(is_activity)) for x in section.find_all('table')])
		for activity in section:
			tmp = dict()
			try:
				tmp['section'] = activity.find('td', attrs={'class':'Section'}).text
				tmp['activity'] = activity.find('td', attrs={'class':'Activity'}).text
				tmp['time'] = activity.find('td', attrs={'class':'Day'}).text
				tmp['location'] = activity.find('td', attrs={'class':'Place'}).text
				tmp['professor'] = activity.find('td', attrs={'class':'Professor'}).text
			except AttributeError as e:
				print(activity)
				print(activity['class'])
				raise e
			activities.append(tmp)
		sections.append(activities)

	return sections
