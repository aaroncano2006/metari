const bcrypt = require('bcrypt');

//handles bigint values for prisma
const handleBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );

const hash = async (strToHash) => {
  const saltRounds = 12; // 1024 iteracions per encriptar la contrasenya.
  // Quantes més iteracions, més segura és l'encriptació.

  return await bcrypt.hash(strToHash, saltRounds);
};

const compareHash = async (txtToCompare, hashToCompare) => {
  return await bcrypt.compare(txtToCompare, hashToCompare);
};

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

module.exports = {
    handleBigInt,
    hash,
    compareHash,
    normalizeDate
};