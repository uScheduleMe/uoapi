import unittest
from HTTMock import urlmatch, HTTMock
import query_timetable as qt


class MockServer:

    def __init__(self):
        with open("data/get_response.html", "r") as f:
            self.response = f.read()
        with open("data/get_icsid.txt", "r") as f:
            self.icsid = f.read()
        self.status_code = 200

    @urlmatch(netloc=r"(.*[.])?uocampus.public.uottawa.ca/.+")
    def http_response(self, url, request):
        self.url = url
        self.request = request
        return {"status_code": self.status_code,
                "content": self.response}


class TestTimetableLookup(unittest.TestCase):

    default_headers = {'Content-Type':"application/x-www-form-urlencoded"}


    def setUp(self):
        self.mock_server = MockServer()
        with HTTMock(self.mock_server.http_response):
            self.tl = qt.TimetableLookup()
        self.get_response = self.mock_server.response
        self.get_icsid = self.mock_server.icsid


    def test_refresh(self):

        # Testing good server response(s)
        with HTTMock(self.mock_server.http_response):
            self.tl.refresh()
        self.good_refresh(self.get_icsid)

        # Testing bad server response(s)
        with self.subTest("Bad status code"):
            self.bad_refresh(400)
        with self.subTest("Bad content"):
            self.bad_refresh(200)


    def good_refresh(
        self,
        icsid=None,
        action="CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH",
        statenum="1",
    ):

        with self.subTest("TimetableLookup ready"):
            self.assertIs(self.tl.ready, True)

        with self.subTest("Has ICAction"):
            self.assertIsIn("ICAction", self.tl.form)
            self.assertEqual(self.tl.form["ICAction"], 
                             action)

        with self.subTest("ICStateNum set"):
            self.assertIsIn("ICStateNum", self.tl.form)
            self.assertEqual(self.tl.form["ICStateNum"], statenum)

        with self.subTest("ICSID set"):
            self.assertIsIn("ICSID", self.tl.form)
            if icsid is not None:
                self.assertEqual(
                    self.tl.form["ICSID"], 
                    icsid
                )
            else:
                self.assertIsInstance(self.tl.form["ICSID"], str)
                self.assertGreater(len(self.tl.form["ICSID"]), 0)

        with self.subTest("Open courses only set off"):
            self.assertIsIn(
                "SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$0",
                self.tl.form
            )
            self.assertEqual(
                self.tl.form["SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$0"],
                "N"
            )
            self.assertIsIn(
                "SSR_CLSRCH_WRK_SSR_OPEN_ONLY$0",
                self.tl.form
            )
            self.assertEqual(
                self.tl.form["SSR_CLSRCH_WRK_SSR_OPEN_ONLY$0"],
                "N"
            )


    def bad_refresh(self, status_code, response="blah"):
        self.mock_server.response = response
        self.mock_server.status_code = status_code
        icsid = self.tl.form["ICSID"]

        with HTTMock(self.mock_server.http_response):
            self.tl.refresh()

        self.assertIs(self.tl.ready, False)
        self.assertEqual(self.tl.form["ICSID"], icsid)


    def test_init(self):
        with self.subTest("Form loaded"):
            self.assertIsInstance(self.tl.form, dict)

        with self.subTest("Default headers set"):
            self.assertDictEqual(self.tl.default_headers,
                                 self.default_headers)

    def test_format_query(self):
        #test messy year
        #test bad year

        #test messy term
        #test bad term

        #test messy subject
        #test bad subject

        #test messy number
        #test bad number
        pass


    def tearDown(self):
        pass


