const generateUserRegisterationEmail = (username,token) => {
  const link = process.env.WEBLINK;
  return `

 <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        }
        .button:hover {
            background: #0056b3;
        }
        p {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to social</h2>
        <p>Hello <strong>${username}</strong>,</p>
        <p>click to activate your account</p>
        <a href="http://${link}/${token}" class="button">Activate Account</a>
       
        <p>Thanks, <br> The Team</p>
    </div>
</body>
</html>`;
};

module.exports = generateUserRegisterationEmail;
