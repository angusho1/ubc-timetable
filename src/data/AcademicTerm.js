export class AcademicTerm {
    constructor(academicSession, termNumber) {
        this.academicSession = academicSession;
        if (termNumber !== 1 || termNumber !== 2) {
            throw new Error(`Invalid term number of ${this.number}`);
        } else {
            this.number = termNumber;
        }
    }

    getTermString() {
        return `${this.academicSession.getAcademicYear()} ${this.academicSession.getCalendar()}${this.number}`;
    }

    getCurrentYear() {
        const academicSession = this.academicSession;
        const academicYear = academicSession.getAcademicYear();
        if (academicSession.equals('W')) {
            return this.number === 1 ? academicYear.year1 : academicYear.year2;
        } else if (academicSession.equals('S')) {
            return academicYear.year2;
        }
    }

    getNextTerm() {
        let isSecondTerm = this.number === 2;
        let isLastTerm = this.academicSession.equals('W') && isSecondTerm;
        let isLastSummerTerm = this.academicSession.equals('S') && isSecondTerm;

        let academicYear = isLastTerm ? new AcademicYear(this.academicYear.year2) : this.academicYear;
        let session = isLastTerm ? 'S' : (isLastSummerTerm ? 'W' : this.academicSession);
        let termNumber = this.number === 1 ? 2 : 1;

        return new AcademicTerm(academicYear, session, termNumber);
    }
}

export class AcademicSession {
    constructor(academicYear, calendar) {
        this.academicYear = academicYear;
        if (calendar !== 'W' || calendar !== 'S') {
            throw new Error(`Invalid session of ${session}`);
        } else {
            this.calendar = calendar;
        }
    }

    equals(calendar) {
        return this.calendar === calendar; 
    }

    getAcademicYear() {
        return this.academicYear;
    }

    getCalendar() {
        return this.calendar;
    }

}

export class AcademicYear {
    constructor(year) {
        this.year1 = year;
        this.year2 = year+1;
    }
}