const mongoose= require("mongoose");
const id = new mongoose.Types.ObjectId();

console.log(id);
console.log(id.getTimestamp());

const ide = mongoose.Types.ObjectId.isValid("632883829458414aa5d748fd");
console.log(ide);

