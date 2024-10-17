// Kaden Emrich

class Test {
    constructor(name, func, expectedOutput, acceptableVariance = 0) {
        this.name = name;
        this.func = func;
        this.expectedOutput = expectedOutput;
        this.acceptableVariance = Math.abs(acceptableVariance);
    } // constructor

    run(doReport = true) { // works only on numbers
        let isSuccessful = true;
        let report = '';
        let output = this.func();
        let variance = Math.abs(output / this.expectedOutput - 1);
        // console.log(variance);

        if(variance > this.acceptableVariance) {
            isSuccessful = false;
            report = `'${this.name}' was unsuccessful. Expected: ${this.expectedOutput}, Got: ${output} \n(Variance: ${Math.floor(10000*variance)/100}%)`;

            if(doReport) {
                console.warn(report);
            }
        }
        else {
            report = `'${this.name}' was successful. \n(Variance: ${Math.floor(10000*variance)/100}%)`;

            if(doReport) {
                console.log(report);
            }
        }

        return {
            test : this,
            report : report,
            isSuccessful : isSuccessful
        };
    } // run()
} // class Test

class TestGroup {
    constructor(tests) {
        this.tests = tests;
    } // constructor

    run(fullSummary = false) {
        let results = [];
        let failures = [];
        for(let i = 0; i < this.tests.length; i++) {
            let result = this.tests[i].run(false);
            results.push(result);

            if(!result.isSuccessful) {
                failures.push(i);
                console.warn(result.report);
            }
            else if(fullSummary) {
                console.log(result.report);
            }
            
        }

        if(failures.length > 0) {
            console.warn(`${failures.length} of ${results.length} tests unsuccessful!`);
        }
        else {
            console.log(`All ${results.length} tests successsful!`);
        }
    }
} // class TestGroup
