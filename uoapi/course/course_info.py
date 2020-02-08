import patterns as pt
import itertools as it

class Prereq:
    '''
    Object used to hold information about prereqs and other information that is provided in the courseblockextra section of the uOttawa catalogue
    '''
    rep_codes = {
        "credit_count" : "YYY0000",
        "ForU" : "YYY0001",
        "for_special_program" : ") or ("
    }

    def parse_codes(self, parsable):
        '''
        Turns a string of parsable codes into a list of prerequiste groups that are each sufficient to get into the course
        A string of parsable codes is defined as any string of course codes seperated by any of [/ or ou , and et] and parentheses for priotirty.
        '''

        parsable = self.match_to_string(parsable)

        #Replace all parenthesised groups with a unique fake course code. This makes it possible to look at
        #each group as a single course until we sub them back in later and apply the rules we need for them.
        #Essentially this is priority of operations but it's easier to do them in reverse here
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
                    break   #This increments to the next replacement code and starts from the beginning of the string
            else:   #When we reach the end of the string we're done
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
            while True: #This is to overcome the problem with modifying a list as you iterate over it, kind of a hack but it works
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
        match_str = "(" + match_str + ")"

        # The try is for when the pattern didn't include those groups,
        # the if is if they were included but not part of the match
        for key, value in self.rep_codes.items():
            try:
                if match_obj.group(key) != None:
                    self.subs[key] = match_obj.group(key)
                    match_str = match_str.replace(match_obj.group(key), value)
            except IndexError:
                pass

        match_str = match_str.replace(" ou ", " or ").replace("/", " or ").replace(" and ", ", ").replace(" et ", ", ")

        return match_str

    def __init__(self, prereq_str):

        self.prereqs = []
        self.subs = {
            "credit_count" : "",
            "ForU" : "",
            "for_special_program" : ""
        }

        sentences = filter(None, prereq_str.replace(' / ', '. ').split('. '))
        for sentence in sentences:
            for key, pattern in pt.prereq.items():
                match = pattern.search(sentence)
                if match is not None:
                    if key == "prerequisites":
                        self.prereqs = self.parse_codes(match)
                    break


