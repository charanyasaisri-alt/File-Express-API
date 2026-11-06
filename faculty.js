import express from 'express';
import fs from 'fs';

const app = express();

// Middleware to read JSON data from request body
app.use(express.json());

const readData=() => {
    const data = fs.readFileSync('./data/faculty.json', 'utf8');
    return JSON.parse(data);
}

const writeData=(data) => {
    fs.writeFileSync('./data/faculty.json', JSON.stringify(data, null, 2));
}

// 1. POST - Create a new faculty URL: http://localhost:5000/faculty
app.post("/api/v1/faculty", (req, res) => {
    const allFaculty = readData();

    const newFaculty = {id:allFaculty.length > 0 ? Math.max(...allFaculty.map(f => f.id)) + 1 : 1, ...req.body};

    allFaculty.push(newFaculty);
    writeData(allFaculty);

    res.status(201).json({
        message: "Faculty created successfully",
        data: newFaculty
    });
});


// ==================================================
// 2. GET - Read all faculty
// URL: http://localhost:5000/faculty
// URL: http://localhost:5000/faculty?dept=CSE
// ==================================================
app.get("/api/v1/faculty", (req, res) => {
    const { dept } = req.query;
    let faculty = readData();
    if (dept) {
        faculty = faculty.filter((f) => f.dept === dept);
    }
    res.status(200).json({
        message: "Faculty fetched successfully",
        data: faculty
    });
});


// ==================================================
// 3. GET - Read faculty by ID
// URL: http://localhost:5000/faculty/:id
// ==================================================
app.get("/api/v1/faculty/:id", (req, res) => {

    const facultyId = parseInt(req.params.id);

    const facultyMember = readData().find(
        (f) => f.id === facultyId
    );

    if (facultyMember) {

        res.status(200).json({
            message: "Faculty details fetched successfully",
            data: facultyMember
        });

    } else {

        res.status(404).json({
            message: "Faculty not found"
        });

    }
});


// ==================================================
// 4. PUT - Update faculty by ID
// URL: http://localhost:5000/faculty/:id
// ==================================================
app.put("/api/v1/faculty/:id", (req, res) => {

    const facultyId = parseInt(req.params.id);

    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex(
        (f) => f.id === facultyId
    );

    if (facultyIndex !== -1) {

        const updatedFaculty = {
            ...allFaculty[facultyIndex],
            ...req.body
        };
        allFaculty[facultyIndex] = updatedFaculty;
        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty updated successfully",
            data: updatedFaculty
        });

    } else {

        res.status(404).json({
            message: "Faculty not found"
        });

    }
});


// ==================================================
// 5. DELETE - Delete faculty by ID
// URL: http://localhost:5000/faculty/:id
// ==================================================
app.delete("/api/v1/faculty/:id", (req, res) => {

    const facultyId = parseInt(req.params.id);

    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex(
        (f) => f.id === facultyId
    );

    if (facultyIndex !== -1) {

        const deletedFaculty =
            allFaculty.splice(facultyIndex, 1)[0];

        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty deleted successfully",
            data: deletedFaculty
        });

    } else {

        res.status(404).json({
            message: "Faculty not found"
        });

    }
});


// ==================================================
// Start the server
// ==================================================
app.listen(5000, () => {

    console.log(
        "Server is running at http://localhost:5000/"
    );

});
//C:\Users\Admin>curl -X POST http://localhost:5000/api/v1/faculty/ -H "Content-Type: application/json" -d "{\"name\":\"Dr.Kumar\",\"department\":\"CSE\",\"subject\":\"Java\"}"
//{"message":"Faculty created successfully","data":{"id":3,"name":"Dr.Kumar","department":"CSE","subject":"Java"}}
//C:\Users\Admin>curl -X POST http://localhost:5000/api/v1/faculty/ -H "Content-Type: application/json" -d "{\"name\":\"Dr.Ravi Kumar\",\"department\":\"ECE\",\"subject\":\"DE\"}"
//{"message":"Faculty created successfully","data":{"id":4,"name":"Dr.Ravi Kumar","department":"ECE","subject":"DE"}}
//C:\Users\Admin>curl -X GET http://localhost:5000/api/v1/faculty/
//{"message":"Faculty fetched successfully","data":[{"id":1,"name":"Ravi Kumar","dept":"CSE","salary":50000},{"id":2,"name":"Anita","dept":"ECE","salary":48000},{"id":3,"name":"Dr.Kumar","department":"CSE","subject":"Java"},{"id":4,"name":"Dr.Ravi Kumar","department":"ECE","subject":"DE"}]}
//C:\Users\Admin>curl -X GET http://localhost:5000/api/v1/faculty/1
//{"message":"Faculty details fetched successfully","data":{"id":1,"name":"Ravi Kumar","dept":"CSE","salary":50000}}
//C:\Users\Admin>curl -X PUT http://localhost:5000/api/v1/faculty/1 -H "Content-Type: application/json" -d "{\"name\":\"Dr.Kumar\",\"department\":\"EEE\",\"subject\":\"Java\"}"
//{"message":"Faculty updated successfully","data":{"id":1,"name":"Dr.Kumar","dept":"CSE","salary":50000,"department":"EEE","subject":"Java"}}
//C:\Users\Admin>curl -X DELETE http://localhost:5000/api/v1/faculty/1
//{"message":"Faculty deleted successfully","data":{"id":1,"name":"Dr.Kumar","dept":"CSE","salary":50000,"department":"EEE","subject":"Java"}}