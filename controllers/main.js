const axios = require('axios');
const User = require('../models/models.js');

const main = {
    root: async (req, res) => {
        if (req.user) {
          const user = await User.findById(req.user._id);
          const showIds = user.nopeList;
          const showPromises = showIds.map((id) => axios.get(`http://api.tvmaze.com/shows/${id}`));
      
          try {
            const showResponses = await Promise.all(showPromises);
            const shows = showResponses.map((response) => response.data);
            res.render('home', { shows });
          } catch (error) {
            console.error(error);
            res.render('error');
          }
        } else {
          res.render('home');
        }
      },

    //search function
    results: async (req, res) => {
        const query = req.query.q;
        const url = `http://api.tvmaze.com/search/shows?q=${query}`;
    
        try {
            const response = await axios.get(url);
            const data = response.data;
            const user = await User.findById(req.user._id); // fetch user's data
            const nopeList = user.nopeList; // get user's nopeList
    
            // Add isInNopeList property to each show object
            const showsWithNopeStatus = data.map(show => {
                return {
                    ...show,
                    isInNopeList: nopeList.includes(show.show.id.toString())
                };
            });
    
            res.render('results', {query:query, shows: showsWithNopeStatus, nopeList: nopeList}); // pass nopeList to template
        } catch (error) {
            console.error(error);
            res.render('error');
        }
    },

    add: async (req, res) => {
        const showId = req.params.showId;
        const userId = req.user._id;
      
        try {
          const user = await User.findById(userId);
          user.nopeList.push(showId);
          await user.save();
          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.sendStatus(500);
        }
      },

      remove: async (req, res) => {
        const showId = req.params.showId;
        const userId = req.user._id;
        
        try {
          const user = await User.findById(userId);
          user.nopeList = user.nopeList.filter((id) => id !== showId); // Remove the show ID from the user's Nope List
          await user.save();
          res.sendStatus(200);
        } catch (error) {
          console.error(error);
          res.sendStatus(500);
        }
      },

    login: async (req, res) => {
        res.render('login');
    }
};
module.exports = main;

    //   report: async (req, res) => {
    //     try {
    //       const disasters = await Disaster.find();
    //       const ObjectId = mongoose.Types.ObjectId;
    //       const updatedDisasters = disasters.map(disaster => {
    //         return {
    //           _id: new ObjectId(disaster._id),
    //           name: disaster.name
    //         };
    //       });
    //       res.render('report', { disasters: updatedDisasters });
    //     } catch (err) {
    //       console.log(err);
    //       req.session.flash = {
    //         type: "danger",
    //         intro: "Report Failed",
    //         message: "Unable to submit report"
    //       };
    //       res.redirect('/report');
    //     }
    //   },

    //   processReport: async (req, res) => {
    //     req.body.username = req.session.user.username;
    //     req.body.dateFiled = new Date().toLocaleDateString();
    //     let newReport = new Report(req.body);
    //     try {
    //       await newReport.save();
    //       req.session.flash = {
    //         type: "success",
    //         intro: "Success",
    //         message: "Report submitted"
    //       };
    //     } catch (err) {
    //       console.log(err);
    //       req.session.flash = {
    //         type: "danger",
    //         intro: "Report Failed",
    //         message: "Unable to process report"
    //       };
    //     }
    //     res.redirect('/report');
    //   },

    //   search: (req, res) => {
    //     res.render('search');
    //   },

    //   processSearch: async (req, res) => {
    //     try {
    //       const { firstName, lastName, areaCode, exchange, extension } = req.body;
    //       const reports = await Report.find({
    //         firstName: { $regex: new RegExp(firstName, 'i') },
    //         lastName: { $regex: new RegExp(lastName, 'i') },
    //         areaCode: areaCode,
    //         exchange: exchange,
    //         extension: extension
    //       }).lean();

    //       if (reports.length > 0){
    //         res.render("search", { reports: reports });
    //       } else {
    //         req.session.flash = {
    //           type: "danger",
    //           intro: "Search Failed",
    //           message: "Unable to find reports",
    //         };
    //         res.redirect("/search");
    //       }
    //     } catch (err) {
    //       console.log(err);
    //       req.session.flash = {
    //         type: "danger",
    //         intro: "Search Failed",
    //         message: "Unable to find reports",
    //       };
    //       res.redirect("/search");
    //     }
    //   },

    //   dashboard: async (req, res) => {
    //     const disasters = await Disaster.find().lean();

    //     for (const disaster of disasters) {
    //       const count = await Report.countDocuments({ disaster: disaster._id });
    //       disaster.count = count;
    //     }

    //     res.render('dashboard', { disasters: disasters });
    //   },

    //   detail: async (req, res) => {
    //     try {
    //       const disaster = await Disaster.findOne({ name: req.query.id });
    //       const reports = await Report.find({ disaster: disaster._id }).populate('disaster').lean();
    //       res.render('detail', { disaster, reports });
    //     } catch (err) {
    //       console.error(err);
    //       res.status(500).send('Server Error');
    //     }
    //   },