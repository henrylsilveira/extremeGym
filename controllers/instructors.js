const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../utils');

exports.index = function (req, res) {



    return res.render("instructors/index", { instructors: data.instructors });
}

//show
exports.show = function (req, res) {
    //req.query.id
    //req.body
    //req.params.id ou (.members) = /:id/:members

    const { id } = req.params;

    const foundInstructors = data.instructors.find(function (instructor) {
        return id == instructor.id;
    })

    if (!foundInstructors) return res.send("Instructors not found!");


    const instructor = {
        ...foundInstructors,
        age: age(foundInstructors.birth),
        services: foundInstructors.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructors.created_at)
    }

    return res.render("instructors/show", {
        instructor: instructor
    })
}

exports.create = function (req, res) {
    return res.render("instructors/create");
}

//create
exports.post = function (req, res) {

    //Função que pega todas as chaves do object e verifica se tem algum dado.
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields');
        }
    }

    //Trata os dados para que seja utilizado somente oq for necessário
    let {
        avatar_url,
        birth,
        name,
        services,
        gender
    } = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.instructors.length + 1);

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    });

    //Função que armazena os dados em um arquivo "data.json" sendo necessário converte-lo com JSON.stringify logo após recebe um callback.
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) {
            return res.send("Write file error")
        }
        return res.redirect("/instructors")
    })

}

//edit
exports.edit = function (req, res) {

    const { id } = req.params;

    const foundInstructors = data.instructors.find(function (instructor) {
        return id == instructor.id;
    })

    if (!foundInstructors) return res.send("Instructors not found!");
    
    const instructor = {
        ...foundInstructors,
        birth: date(foundInstructors.birth).iso
    }
    
    return res.render('instructors/edit', {instructor: instructor});
}

//update
exports.put = function(req,res) {
    const { id } = req.body;
    let index = 0;

    const foundInstructors = data.instructors.find(function (instructor, foundIndex) {
        if(id == instructor.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundInstructors) return res.send("Instructors not found!");

    const instructor = {
        ...foundInstructors,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!");

        return res.redirect(`/instructors/${id}`);
    })

}

//delete

exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id;
    });

    data.instructors = filteredInstructors;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write fill error!");

        return res.redirect("/instructors");
    })
}