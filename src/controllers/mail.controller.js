const { mailingService } = require('../services/');

module.exports.sendWithTemplate = async (req, res) => {
  const data = [
    {
      to: 'shaonmak@gmail.com',
      data: {
        code: '696969',
      },
    },
  ];
  await mailingService.send(data, (err, success) => {
    if (err) {
      console.log(err);
    }
    if (success) {
      return res.status(200).json({ data: savedMail });
    } else {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error saving mail', err });
    }
  });
};
