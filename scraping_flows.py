import json
import pandas as pd
from scraping_utils import *


#############################################################################
# FLOWS
#############################################################################


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

#@TODO move these two reading functions elsewhere?
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

