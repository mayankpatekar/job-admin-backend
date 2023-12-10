const express = require('express')
const { User, Job, Application } = require('../models/models');
const sendEmail = require("../middleware/sendEmail");



const router = express.Router()

router.get("/:jobid", async (req, res) => {
    const { jobid } = req.params;
    try {
        // const jobs  = await Job.find({_id:id});
        const applications = await Application.find({ JobId: jobid });
        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ message: "something bad at server" });
    }
})

router.put("/put/:appid", async (req, res) => {
    const { appid } = req.params;
    const { status } = req.body;
    let textMessage;
    // console.log();
    try {
        const application = await Application.findOne({ _id: appid });
        if (application) {

            console.log(status, appid, application.UserId);
            const user = await User.findById(application.UserId);
console.log(user);
            application.Status = status;
            await application.save();
            console.log(status, appid, "after save");

            if (status === "Rejected") {
                textMessage = '<p>We regrate to inform you that we cant select your application as <br/> we move with the different candidate<br/><bold>Your regards</bold><br/><bold>abc Pvt.lmt.</bold></p>'
            } else {
                textMessage = '<p>Congratulations !<br/>Your application got selected by our company wait for further information to get you<br/><bold>Your regards</bold><br/><bold>abc Pvt.lmt.</bold></p>'
            }
            sendEmail({
                to: user.email,
                subject: "Your application status updated",
                text: textMessage
            })
            res.status(200).json({ message: `${status} successfully` });
        }

    } catch (err) {
        res.status(500).json({ message: "something bad in server" });
    }
})


module.exports = router