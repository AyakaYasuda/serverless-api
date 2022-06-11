const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});

const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "auth-test-users";

const register = async userInfo => {
  const name = userInfo.name;
  const email = userInfo.email;
  const username = userInfo.username;
  const password = userInfo.password;
  if (!name || !email || !username || !password) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }

  const dynamoUser = await getUser(username);
  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, {
      message:
        "Username already exists in our database. Please choose a different username",
    });
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name,
    email,
    username: username.toLowerCase().trim(),
    password: encryptedPW,
  };

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again later",
    });
  }

  return util.buildResponse(200, {
    username: username,
  });
};

const getUser = async username => {
  const params = {
    TableName: userTable,
    Key: {
      username,
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      response => {
        return response.Item;
      },
      error => {
        console.error("There is an error while getting user: ", error);
      }
    );
};

const saveUser = async user => {
  const params = {
    TableName: userTable,
    Item: user,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      error => {
        console.error("There is as error while saving user: ", error);
      }
    );
};

module.exports.register = register