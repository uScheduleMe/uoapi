### Installation

At the moment, this project is still in development,
so please fork/install from the `dev` branch.
Once the project is ready for release,
changes will be pushed to the master branch (default),
at which point you should install from there.
```bash
>pip install git+https://github.com/andrewnags/uOcourses.git@dev
```

### Usage

```bash
>uoapi timetable --term winter --year 2020 CSI3104 PHY4 YDD
(timetables for CSI3104, all fourth-year physics courses, and all Yiddish courses)
>uoapi course --courses MAT PHY
(info on all subjects, and MAT and PHY courses)
>uoapi course --nosubjects CSI3105 CSI3131
(info on these specific courses)
>uoapi dates
(info on important dates for all available semesters)
```

See the wiki for sample outputs.

### Contributing

Contributions are welcome! Please see the `CONTRIBUTING.md` file for more.

### License

GNU LGPLv3.0

See the `COPYING` and `COPYING.LESSER` files for the exact license.

Generally speaking, LGPL permits use, distribution, and alteration in open source (as long as the licence is propagated), 
and permits use and distribution in closed source projects
(this is **not** legal advice, just my best personal summary).