const fs = require('fs');
const data = require('../data.json');
const { age,date } = require('../utils');

exports.index = function (req, res) {



    return res.render("members/index", { members: data.members });
}

//show
exports.show = function (req, res) {
    //req.query.id
    //req.body
    //req.params.id ou (.members) = /:id/:members

    const { id } = req.params;

    const foundMembers = data.members.find(function (member) {
        return id == member.id;
    })

    if (!foundMembers) return res.send("Members not found!");


    const member = {
        ...foundMembers,
        birth: age(foundMembers.birth).birthDay
    }

    return res.render("members/show", {
        member: member
    })
}

exports.create = function (req, res) {
    return res.render("members/create");
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

    birth = Date.parse(req.body.birth);
    const lastMember = data.members[data.members.length - 1];
    let id = 1;
    
    if (lastMember) {
        id = lastMember + 1;
    }

    data.members.push({
        ... req.body,
        id,
        birth
    });

    //Função que armazena os dados em um arquivo "data.json" sendo necessário converte-lo com JSON.stringify logo após recebe um callback.
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) {
            return res.send("Write file error")
        }
        return res.redirect("/members")
    })

}

//edit
exports.edit = function (req, res) {

    const { id } = req.params;

    const foundMembers = data.members.find(function (member) {
        return id == member.id;
    })

    if (!foundMembers) return res.send("Members not found!");
    
    const member = {
        ...foundMembers,
        birth: date(foundMembers.birth).iso
    }
    
    return res.render('members/edit', {member: member});
}

//update
exports.put = function(req,res) {
    const { id } = req.body;
    let index = 0;

    const foundMembers = data.members.find(function (member, foundIndex) {
        if(id == member.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundMembers) return res.send("Members not found!");

    const member = {
        ...foundMembers,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error!");

        return res.redirect(`/members/${id}`);
    })

}

//delete
exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredMembers = data.members.filter(function(member){
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write fill error!");

        return res.redirect("/members");
    })
}