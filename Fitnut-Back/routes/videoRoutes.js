const router = require("express").Router();
const mongoose = require("mongoose");
const Videos = require("../models/video_model");
const { GOOGLEAPI } = require('../config');
const Axios = require('axios');

// Simple endpoint to send top 20 to the front. 

const pulltime = (timeStr) => {
    timeStr = timeStr.replace('PT', '').split('')
    if (!timeStr.includes('M') && !timeStr.includes('H')){
        return 1
    } else{
        let time = 0
        if(timeStr.includes('H')){
            let hourStr = ''
            let repl = ''
            for(let i = 0; i != timeStr.length; i++){
                if (timeStr[i] === 'H'){
                    timeStr[i] = '*'
                    repl = repl + '*'
                    break;
                }
                hourStr = hourStr + timeStr[i]
                timeStr[i] = '*'
                repl = repl + '*'
            }
            time = time + parseInt(hourStr) * 60
            timeStr = timeStr.join('')
            timeStr = timeStr.replace(repl,'')
            timeStr = timeStr.split('')
        }

        if(timeStr.includes('M')){
            let minStr = ''
            for(let i = 0; i != timeStr.length; i++){
                if (timeStr[i] === 'M'){
                    break;
                }
                minStr = minStr + timeStr[i]
            }
            time = time + parseInt(minStr)
        }

        return time
    }
}

router.post("/addVideo", async (req, res) => {
    /*
        Input: {
            videoID: STRING,
            category: WILL IMPLEMENT DOWN THE LINE,
            diff: INT,
        }
        Output: {
            Will return 200 if added and error otherwise
        }
    */ 
    const { videoID, diff, category } = req.body
    if (videoID.length === 0){
        return res.status(400).json({message: 'Make sure to send ID'})
    }

    let doesExist = await Videos.findOne({videoID})
    if (doesExist !== null){
        return res.status(400).json({message: 'Id already exists'})
    }
    
    try{
        answer = await Axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videoID}&key=${GOOGLEAPI}`)
    } catch(err){
        return res.status(400).json(err)
    } 
    
    answer = answer.data
    if (answer.items.length === 0){
        return res.status(400).json({message: 'ID Not Recognized'})
    }
    
    let dura = pulltime(answer.items[0].contentDetails.duration)

    let name = answer.items[0].snippet.title

    let new_id = new mongoose.Types.ObjectId();
    let newVid = new Videos({
        _id: new_id,
        videoID, 
        category,
        duration: dura,
        name,
        diff: parseInt(diff)
    })
    
    try{
        const savedVid = await newVid.save()
        return res.status(200).json({message: 'Successfully Saved'})
    } catch(err){
        return res.status(400).json({message: 'Did Not Successfully Saved'})
    }
})

router.post("/updateVideo", async (req, res) => {
    /*
        Input: {
            id: ID,
            videoID: STRING,
            category: WILL IMPLEMENT DOWN THE LINE,
            diff: INT
        }
        Output: {
            Will return 200 if updated and error otherwise
        }
    */ 
    const { id, videoID, diff, category } = req.body
    let entry = await Videos.findById(id)
    if (entry === null){
        return res.status(400).json({message: 'Entry ID not valid'})
    }

    if (videoID.length === 0){
        return res.status(400).json({message: 'Make sure to send ID'})
    }
    
    try{
        answer = await Axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videoID}&key=${GOOGLEAPI}`)
    } catch(err){
        return res.status(400).json(err)
    } 
    
    answer = answer.data
    if (answer.items.length === 0){
        return res.status(400).json({message: 'ID Not Recognized'})
    }

    let dura = pulltime(answer.items[0].contentDetails.duration)
    
    let newName = answer.items[0].snippet.title

    entry.videoID = videoID
    entry.category = category
    entry.diff = parseInt(diff)
    entry.name = newName
    entry.duration = dura
    
    try{
        const updated = await entry.save()
        return res.status(200).json(entry)
    } catch(err){
        return res.status(400).json({message: 'Did Not Successfully Update'})
    }
})

router.post("/deleteVideo", async (req, res) => {
    /*
        Input: {
            id: ID
        }
        Output: {
            Will return 200 if deleted and error otherwise
        }
    */ 
    const { id } = req.body
    try{
        await Videos.deleteOne({_id: id})
        return res.status(200).json({message: 'Successfully Deleted'})
    } catch(err){
        return res.status(400).json({message: 'Did Not Successfully Delete'})
    }
})

router.post("/allVideos", (req, res) => {
    Videos.find({}, (err, vids) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(vids);
      }
    });
})

module.exports = router;