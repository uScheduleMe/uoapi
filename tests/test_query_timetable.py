import os
import unittest
import json

import regex as re
from httmock import urlmatch, HTTMock

import query_timetable as qt

def absolute_path(path):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)


class MockServer:

    def __init__(self):
        # Loading GET data
        self.get = {}
        with open(absolute_path("data/get_response.html"), "r") as f:
            self.get["good"] = f.read()
        with open(absolute_path("data/bad_get_response.html"), "r") as f:
            self.get["bad"] = f.read()
        # Loading POST data
        self.post = {}
        with open(absolute_path("data/post_response.html"), "r") as f:
            self.post["good"] = f.read()
        with open(absolute_path("data/not_found.html"), "r") as f:
            self.post["not found"] = f.read()
        self.post["bad"] = self.get["good"]
        self.get["bad format"] = self.post["good"]
        with open(absolute_path("data/get_icsid.txt"), "r") as f:
            self.icsid = f.read().strip()
        # Setting default responses
        self.status_code = 200
        self.swap_responses("GET", "good")
        self.swap_responses("POST", "good")

    @urlmatch(netloc=r".*uocampus[.]public[.]uottawa[.]ca.*")
    def http_response(self, url, request):
        self.url = url
        self.request = request
        if "GET" == request.method:
            return {"status_code": self.status_code,
                    "content": self.get_response}
        elif "POST" == request.method:
            return {"status_code": self.status_code,
                    "content": self.post_response}
        else:
            raise NotImplementedError("Only GET and POST responses implemented")

    def swap_responses(self, method="GET", target="good"):
        if "GET" == method:
            self.get_response = self.get[target]
        elif "POST" == method:
            self.post_response = self.post[target]
        else:
            raise NotImplementedError("Only GET and POST responses implemented")


class TestTimetableQuery(unittest.TestCase):

    default_headers = {'Content-Type':"application/x-www-form-urlencoded"}


    def setUp(self):
        self.mock_server = MockServer()
        self.tq = qt.TimetableQuery()
        #with HTTMock(self.mock_server.http_response):
        #    self.tq = qt.TimetableQuery()
        #self.get_response = self.mock_server.response

    def check_in_context(self, in_context=False):
        if in_context:
            self.assertTrue(self.tq.in_context)
            self.assertIsNotNone(self.tq.session)
            self.assertIsNotNone(self.tq.messages)
        else:
            self.assertFalse(self.tq.in_context)
            self.assertIsNone(self.tq.session)
            self.assertIsNone(self.tq.messages)

    def test_context(self):
        with self.subTest("good context"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.check_in_context(False)
            with HTTMock(self.mock_server.http_response):
                with self.tq as messages:
                    self.check_in_context(True)
                    self.assertEqual(self.mock_server.icsid, self.tq.form["ICSID"])
            self.check_in_context(False)
        with self.subTest("require_context"):
            self.check_in_context(False)
            self.assertRaises(Exception, self.tq.refresh)
            r, m = self.tq(2020, "winter", "mat", 3121)
            self.assertEqual(r, "")
            self.assertIn({
                "type": "error",
                "message": "Could not connect to school server",
            }, m)
        with self.subTest("bad context status code"):
            self.mock_server.status_code = 400
            self.mock_server.swap_responses("GET", "good")
            with HTTMock(self.mock_server.http_response):
                with self.tq as messages:
                    self.check_in_context(False)
            self.check_in_context(False)
        with self.subTest("bad context content"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "bad")
            with HTTMock(self.mock_server.http_response):
                with self.tq as messages:
                    self.check_in_context(False)
            self.check_in_context(False)
            self.assertIn({
                "type": "error",
                "message": "ICSID not found",
            }, messages)
            self.mock_server.swap_responses("GET", "bad format")
            with HTTMock(self.mock_server.http_response):
                with self.tq as messages:
                    self.check_in_context(False)
            self.check_in_context(False)
            self.assertIn({
                "type": "error",
                "message": "GET page has unknown format",
            }, messages)

    def test_init(self):
        self.assertRaises(Exception, qt.TimetableQuery, "{blah}")

    def test_normalize_args(self):
        # Test failures
        with self.subTest("year"):
            self.assertRaisesRegex(
                ValueError, "Year not valid", 
                self.tq.normalize_args, qt.ErrorMessenger(),
                3, "winter", "mat", 3121
            )
        with self.subTest("term"):
            self.assertRaisesRegex(
                ValueError, "Term not valid", 
                self.tq.normalize_args, qt.ErrorMessenger(),
                2020, 2, "mat", 3121
            )
        #@TODO Add test for valid (year, term) not query-able
        with self.subTest("code"):
            self.assertRaisesRegex(
                ValueError, "not a valid query",
                self.tq.normalize_args, qt.ErrorMessenger(),
                2020, "winter", 189, 3121
            )
        # Test success
        with self.subTest("success"):
            self.assertEqual(
                self.tq.normalize_args(qt.ErrorMessenger(), 2020, "winter", "mat", 3121),
                ("2201", "mat", "3121", "course")
            )

    def test_format_form(self):
        # Test "course" search
        with self.subTest("\"course\" search"):
            self.tq.format_form(qt.ErrorMessenger(), 2020, "winter", "mat", 3121)
            for key, val in (
                ("CLASS_SRCH_WRK2_STRM$35$", "2201"),
                ("SSR_CLSRCH_WRK_SUBJECT$0", "mat"),
                ("SSR_CLSRCH_WRK_CATALOG_NBR$0", "3121"),
            ):
                self.assertEqual(self.tq.form[key], val)
            #@TODO check if other keys are not set
        #@TODO Add tests for other search patterns

    def test_call(self):
        with self.subTest("bad input"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            with self.tq:
                response, messages = self.tq(4, "winter", "mat", 3121)
            self.assertEqual(response, "")
            self.assertIn({
                "type": "error",
                "message": "Year not valid",
            }, messages)
        with self.subTest("bad status code"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.mock_server.swap_responses("POST", "good")
            with HTTMock(self.mock_server.http_response):
                with self.tq:
                    self.mock_server.status_code = 400
                    response, messages = self.tq(2020, "winter", "mat", 3121)
            self.assertEqual(response, "")
            self.assertIn({
                "type": "error",
                "message": "POST error: 400",
            }, messages)
        with self.subTest("bad response"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.mock_server.swap_responses("POST", "bad")
            with HTTMock(self.mock_server.http_response):
                with self.tq:
                    response, messages = self.tq(2020, "winter", "mat", 3121)
            self.assertEqual(response, "")
            self.assertIn({
                "type": "error",
                "message": "Unknown error in query response",
            }, messages)
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.mock_server.swap_responses("POST", "not found")
            with HTTMock(self.mock_server.http_response):
                with self.tq:
                    response, messages = self.tq(2020, "winter", "mat", 3121)
            self.assertEqual(response, "")
            self.assertIn({
                "type": "error",
                "message": "No classes found",
            }, messages)
        with self.subTest("good response"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.mock_server.swap_responses("POST", "good")
            with HTTMock(self.mock_server.http_response):
                with self.tq:
                    response, messages = self.tq(2020, "winter", "mat", 3121)
            self.assertEqual(response, self.mock_server.post_response)
            self.assertIn({
                "type": "success",
                "message": "POST success",
            }, messages)
        with self.subTest("semester not available"):
            self.mock_server.status_code = 200
            self.mock_server.swap_responses("GET", "good")
            self.mock_server.swap_responses("POST", "good")
            with HTTMock(self.mock_server.http_response):
                with self.tq:
                    response, messages = self.tq(2020, "fall", "mat", 3120)
            self.assertEqual(response, self.mock_server.post_response)
            self.assertIn({
                "type": "warning",
                "message": "Semester may not be available",
            }, messages)

def clear_messages(mapping, key="messages"):
    if isinstance(mapping, list):
        for elt in mapping:
            clear_messages(elt, key)
    elif isinstance(mapping, dict):
        mapping.pop(key, True)
        for val in mapping.values():
            clear_messages(val, key)


class TestTimetableParse(unittest.TestCase):

    def check_parsed(self, year, term, subject, code, ignore_msgs=False):
        fname = f"tests/data/{subject}{code}_{term}{year}"
        with open(fname + ".html", "r") as f:
            raw = f.read()
        with open(fname + ".json", "r") as f:
            correct = json.load(f)
        parsed = list(qt.extract_timetable(raw, year, term))
        if ignore_msgs:
            clear_messages(parsed)
            clear_messages(correct)
        self.assertEqual(parsed, correct)

    def test_course_examples(self):
        with open("tests/data/examples.tsv", "r") as f:
            examples = [
                re.split("\t+", x.strip())
                for x in f.readlines()
                if not x.strip().startswith("#")
            ]
        for example in examples:
            with self.subTest(example.pop(-1)):
                example[-1] = {
                    "check": False,
                    "ignore": True,
                }.get(example[-1].strip().lower(), False)
                self.check_parsed(*example)

