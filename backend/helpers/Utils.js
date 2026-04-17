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

module.exports = {
    handleBigInt,    
};