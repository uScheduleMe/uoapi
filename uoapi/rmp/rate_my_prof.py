import requests
import json

BASEURL = "https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select"


def get_school_params(school_name):
    '''
    Description: Gets the rate my prof school_id of a school

    Arguments:
    school_name -- Name of the school
    '''
    PARAMS = {"wt": "json", "rows": "1", "q": school_name, "qf": "schoolname_autosuggest"}
    data = requests.get(BASEURL, PARAMS).json()
    school_id = data["response"]["docs"][0]["pk_id"]
    rows = data["response"]["numFound"]
    return {
        "school_id": school_id,
        "rows": rows
    }


def get_teachers_ratings_by_school(school_name):
    '''
    Description: Gets the rate my prof data for a school and writes it to a 'ratings.json' file

    Arguments:
    school_name -- Name of the school
    '''
    params = get_school_params(school_name)
    PARAMS = {
        "wt": "json", 
        "rows": params["rows"], 
        "sort": "total_number_of_ratings_i desc",
        "fl": "pk_id teacherfirstname_t teacherlastname_t total_number_of_ratings_i averageratingscore_rf",
        "q": "*:* AND schoolid_s:"+str(params["school_id"])
    }
    response = requests.get(BASEURL, PARAMS).json()["response"]["docs"]
    ratings =  list(map(
            lambda rating: {
                "rating": rating["averageratingscore_rf"] if "averageratingscore_rf" in rating else -1,
                "total_ratings": rating["total_number_of_ratings_i"],
                "first_name": rating["teacherfirstname_t"],
                "last_name": rating["teacherlastname_t"],
                "teacher_id": rating["pk_id"]
            },
            response,
    ))
    return {
        "ratings": ratings,
        "school_id": params["school_id"],
        "school_name": school_name
    }
    

