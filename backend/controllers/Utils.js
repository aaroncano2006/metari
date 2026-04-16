//handles bigint values for prisma
const handleBigInt = (data) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
module.exports = {
    handleBigInt,    
};