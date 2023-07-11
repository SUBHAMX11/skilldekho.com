import User from "../models/user";
import Course from "../models/course";
const queryString = require("query-string");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
export const makeInstructor = async (req, res) => {
  try {
    //find user from db
    const user = await User.findById(req.auth._id).exec();
    //if user  dont have stripe account_id then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "standard" });
      //console.log(account._id);
      user.stripe_account_id = account.id;
      user.save();

      //create account link based on account id
      let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,
        type: "account_onboarding",
      });

      //pre-fill any info such as email, then send url response to frontend
      accountLink = Object.assign(accountLink, {
        "stripe_user[email]": user.email,
      });

      //then send the account link as response to frontend
      res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error !! Try again");
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.account.retrieve(user.stripe_account_id);
    console.log(account);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      console.log(user);
      res.json(statusUpdated);
    }
  } catch (error) {
    console.log(error);
  }
};
//for instructor protected routes
export const currentInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({
        createdAt: -1,
      })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

export const studentCount = async (req, res) => {
  try {
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const instructorBalance = async (req, res) => {
  try {
    let user = await User.findById(req.auth._id).exec();
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

export const instructorPayoutSettings = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      { redirect_url: process.env.TRIPE_SETTINGS_REDIRECT }
    );
    res.json(loginLink.url);
  } catch (err) {
    console.log("stripe payout settings login link err =>", err);
    toast("Only available for express accounts");
  }
};
