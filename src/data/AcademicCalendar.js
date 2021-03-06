export class AcademicYear {
    constructor(year) {
        this.year1 = year;
        this.year2 = year+1;
    }

    getYear1() {
        return this.year1;
    }

    getYear2() {
        return this.year2;
    }

    getNextAcademicYear() {
        return new AcademicYear(this.year2);
    }

    getPreviousAcademicYear() {
        return new AcademicYear(this.year1 - 1);
    }
}

export class AcademicSession {
    constructor(academicYear, season) {
        this.academicYear = academicYear;
        if (season !== 'W' && season !== 'S') {
            throw new Error(`Invalid session of ${season}`);
        } else {
            this.season = season;
        }
    }

    equals(season) {
        return this.season === season;
    }

    getAcademicYear() {
        return this.academicYear;
    }

    getSeason() {
        return this.season;
    }

    getNextAcademicSession() {
        if (this.season === 'W') {
            return new AcademicSession(this.academicYear.getNextAcademicYear(), 'S');
        } else if (this.season === 'S') {
            return new AcademicSession(this.academicYear, 'W');
        }
    }

    getPreviousAcademicSession() {
        if (this.season === 'W') {
            return new AcademicSession(this.academicYear, 'S');
        } else if (this.season === 'S') {
            return new AcademicSession(this.academicYear.getPreviousAcademicYear(), 'W');
        }
    }
}

export class AcademicTerm {
    constructor(academicSession, termNumber) {
        this.academicSession = academicSession;
        if (termNumber !== 1 && termNumber !== 2) {
            throw new Error(`Invalid term number of ${this.number}`);
        } else {
            this.number = termNumber;
        }
    }

    getTermString() {
        const academicSession = this.academicSession;
        const academicYear = academicSession.getAcademicYear();

        return `${academicYear.getYear1()} ${academicSession.getseason()}${this.number}`;
    }

    getCurrentYear() {
        const academicSession = this.academicSession;
        const academicYear = academicSession.getAcademicYear();
        if (academicSession.equals('W')) {
            return this.number === 1 ? academicYear.year1 : academicYear.year2;
        } else if (academicSession.equals('S')) {
            return academicYear.year1;
        }
    }

    getNextTerm() {
        const currentAcademicSession = this.academicSession;
        const isSecondTerm = this.number === 2;

        let academicSession = isSecondTerm ? currentAcademicSession.getNextAcademicSession() : currentAcademicSession;

        let termNumber = this.number === 1 ? 2 : 1;

        return new AcademicTerm(academicSession, termNumber);
    }

    getPreviousTerm() {
        const currentAcademicSession = this.academicSession;

        const isFirstTerm = this.number === 1;
        let academicSession = isFirstTerm ? currentAcademicSession.getPreviousAcademicSession() : currentAcademicSession;

        let termNumber = this.number === 1 ? 2 : 1;
        
        return new AcademicTerm(academicSession, termNumber);
    }
}
