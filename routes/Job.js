const express = require('express');
const {Job} = require('../models/models.js');


const router = express.Router();

router.post("/",async(req,res)=>{
    const{
        title,
        companyDetails,
        tags,
        skills,
        experienceRequired,
        description,
        salary,
        categorie,
        type
    } = req.body;
    // const skillsArray = Skills.split(',').map(skill => ({ skill: skill.trim() }));

    const skillsArray = skills.split(',').map(skill => ({skill:skill.trim()}));
    const tagsArray = tags.split(',').map(tag => ({tag:tag.trim()}));
    const salaryNew = Number(salary);
    try{

        const job = new Job({
            Title:title,
            CompanyDetails:companyDetails,
            Tags:tagsArray,
            Skills:skillsArray,
            ExperienceRequired:experienceRequired,
            Description:description,
            Salary:salary,
            Categorie:categorie,
            Type:type
        });

        await job.save();
        res.status(200).json({message:"Job added successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something bad in server"});
    }
})

router.get("/",async(req,res)=>{
    try{
        const jobs = await Job.find();
        res.status(200).json({jobs:jobs});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something bad in server"});
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const job = await Job.findById(id);
      
      const skills = job.Skills.map(skillObj => skillObj.skill).join(', ');
    const tags = job.Tags.map(tagObj => tagObj.tag).join(', ');

    const salary = job.Salary.toString();

  
      
      const updatedJob = {
        ...job.toObject(),
        Skills: skills,
        Tags: tags,
        Salary: salary
      };
  
      res.status(200).json({ job: updatedJob });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something bad in server" });
    }
  });
  
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
      Title,
      CompanyDetails,
      Tags,
      Skills,
      ExperienceRequired,
      Description,
      Salary,
      Categorie,
      Type
    } = req.body;
  
    const skillsArray = Skills.split(',').map(skill => ({ skill: skill.trim() }));
    const tagsArray = Tags.split(',').map(tag => ({ tag: tag.trim() }));
    const salaryNew = Number(Salary);
  
    try {
      const updatedJob = await Job.findByIdAndUpdate(id, {
        Title: Title,
        CompanyDetails: CompanyDetails,
        Tags: tagsArray,
        Skills: skillsArray,
        ExperienceRequired: ExperienceRequired,
        Description: Description,
        Salary: salaryNew,
        Categorie: Categorie,
        Type: Type
      });
  
      res.status(200).json({ message: "Job updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something bad in server" });
    }
  });
  


module.exports = router