import regex as re

# Reusable strings
course_code_pattern = r"[A-Z]{3,4}\s*[0-9]{4,5}[A-Za-z]{0,1}"
code_groups_pat = r"([A-Z]{3,4})\s*([0-9]{4,5}[A-Za-z]{0,1})"
not_real_course_codes = r"(?P<ForU>.*[34]U.*)|(?:an )?equivalent|Permission of the School|Permission de l'(?:École|Institut)|Approval of the instructor|Permission du Département"
faculties = r"(?:[Mm]athematics|[Mm]athématiques|[Ss]cience)"
credit_count = (
    r"(?P<credit_count>\d+ crédits de cours(?: en)?(?: %s)? \(?(?:[A-Z]{3}\)?(?: ou [A-Z]{3})* de niveau \d000(?: ou supérieur)*|universitaire)|\d+(?: course)? units (?:of|in)(?: %s)? \(?(?:[A-Z]{3}\)?(?: or [A-Z]{3})*(?: courses)? at(?: the| level)? \d000(?: level)?(?: or above)?|university-level courses?))"
    % (faculties, faculties)
)
for_special_program = (
    r"(?P<for_special_program> or for honors %s students: | ou pour les étudiants et étudiantes inscrits aux programmes spécialisés en %s : )"
    % (faculties, faculties)
)
parsable_codes = r"(?:\(*(?:%s)\)*(?:, |/| or | ou | and | et |%s)?)+" % (
    course_code_pattern + "|" + not_real_course_codes + "|(?:" + credit_count + ")",
    for_special_program,
)

# common patterns
code_re = re.compile(course_code_pattern)
code_groups = re.compile(code_groups_pat)
credit_re = re.compile(
    r"\([0-9]{1,} (unit[s]{0,1}|crédit[s]{0,1})\)|[0-9]{1,} (unit[s]{0,1}|crédit[s]{0,1})"
)
subj_re = re.compile(r"\([A-Z]{3}\)")
href_re = re.compile("[/]{0,1}en/courses/[A-Za-z]{1,}[/]{0,1}")
numbers_re = re.compile("[0-9]{1,}")

# prereq and other courseblockextras patterns
prereq = {
    "not_combined_for_credits": re.compile(
        r"(?:(?<=^(?:(?:The )?[Cc]ourses |Les cours ))%s(?=(?: cannot be combined for (?:units|credits)$| ne peuvent être combinés pour l'obtention de crédits$))|(?<=This course cannot be taken for units by any student who has previously received units for )%s$)"
        % (parsable_codes, course_code_pattern)
    ),
    "no_credits_in_program": re.compile(
        r"(?:This course cannot count for unit in any program in the Faculty of |Prerequisite: This course cannot count as a %s elective for students in the Faculty of |Ce cours ne peut pas compter pour fin de crédits dans un programme de la Faculté des |Préalable : Ce cours ne peut pas compter comme cours au choix en %s pour les étudiants et étudiantes de la Faculté des )%s"
        % (faculties, faculties, faculties)
    ),
    "prerequisites": re.compile(
        r"(?<=^(?:/ )?(?:Prerequisite|Préalable)s?\s*:\s*(?:One of )?)%s$"
        % parsable_codes
    ),
    "corequisite": re.compile(
        r"(?:Corequisite|Concomitant)\s*:\s*%s|%s(?= are prerequisite or corequisite to %s$)|(?<=Les cours )%s(?= sont préalables ou concomitants à %s$)"
        % (
            parsable_codes,
            parsable_codes,
            course_code_pattern,
            parsable_codes,
            course_code_pattern,
        )
    ),
    "CGPA_requirements": re.compile(
        r"(?:Prerequisite: The student must have a minimum CGPA of \d(?:\.|,)\d|Préalable : L'étudiant ou l'étudiante doit avoir conservé une MPC minimale de \d(?:\.|,)\d|Seulement disponible pour les étudiants ayant une MPC de \d,\d et plus)|Open only to students whose cumulative grade point average is \d\.\d or over(?: and the permission of the Department| et avoir la permission du Département)?(?:, and who have completed all the first(?: and second)? year [A-Z]{3} core courses of their program| et ayant réussi tous les cours [A-Z]{3} du tronc commun de niveaux 1000(?: et 2000)? de leur programme)?$"
    ),
    # "credit_count" : re.compile(r"Préalable ?: \d+ crédits de cours(?: en)?(?: %s)? \(?(?:[A-Z]{3}\)?(?: ou [A-Z]{3})* de niveau \d000(?: ou supérieur)*|universitaire)|Prerequisite: \d+(?: course)? units (?:of|in)(?: %s)? \(?(?:[A-Z]{3}\)?(?: or [A-Z]{3})*(?: courses)? at(?: the| level)? \d000(?: level)?(?: or above)?|university-level courses?)$" % (faculties, faculties)),
    # TODO: do some testing to see if you still need this seperate or if it's ok only being part of the prerequisite pattern
    "prior_knowledge": re.compile(
        r"Prerequisites: familiarity with basic concepts in .*|(?:or )?A basic knowledge of .*$|Prerequisite: Some familiarity with .*"
    ),
    "additional_prereqs": re.compile(
        r"Additional prerequisites may be imposed depending on the topic|Des préalables supplémentaires peuvent s'appliquer selon le sujet du cours"
    ),
    "permission": re.compile(
        r"Permission of the Department is required$|Permission du Département est requise.?$"
    ),  # TODO: This should be combined with "not_real_course_codes" or be moved here on it's own
    "interview": re.compile(
        r"Interview with Professor is required$|Entrevue avec le professeur est requise$"
    ),
    "also_offered_as": re.compile(
        r"(?<=^(?:Also offered as |Aussi offert sous la cote ))%s$"
        % course_code_pattern
    ),
    "primarily_intended_for": re.compile(
        r"[Tt]his course is .* for .*$|Ce cours .* principalement(?: destiné)? aux étudiants et étudiantes .*$"
    ),
    "previously": re.compile(r"(?:Previously|Antérieurement) %s" % course_code_pattern),
}
