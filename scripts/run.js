const main = async () => {
  // The first return is the deployer, the second is a random account
  //   const [owner, randomPerson] = await hre.ethers.getSigners();
  const [owner, superCoder] = await hre.ethers.getSigners();

  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // We pass in "ninja" to the constructor when deploying
  const domainContract = await domainContractFactory.deploy("hype");
  await domainContract.deployed();

  console.log("Contract owner:", owner.address);

  // Let's be extra generous with our payment (we're paying more than required)
  let txn = await domainContract.register("a16z", {
    value: hre.ethers.utils.parseEther("1234"),
  });
  await txn.wait();

  // How much money is in here?
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // Quick! Grab the funds from the contract! (as superCoder)
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch (error) {
    console.log("Could not rob contract");
  }

  // Let's look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Balance of owner before withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  // Fetch balance of contract & owner
  const contractBalance = await hre.ethers.provider.getBalance(
    domainContract.address
  );
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log(
    "Contract balance after withdrawal:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "Balance of owner after withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  //   console.log("Contract deployed to:", domainContract.address);
  //   console.log("Contract deployed by:", owner.address);

  // We're passing in a second variable - value. This is the moneyyyyyyyyyy
  //   let txn = await domainContract.register("crypto", {
  //     value: hre.ethers.utils.parseEther("0.1"),
  //   });
  //   await txn.wait();

  //   const domainAddress = await domainContract.getAddress("crypto");
  //   console.log("Owner of domain crypto:", domainAddress);

  //   const balance = await hre.ethers.provider.getBalance(domainContract.address);
  //   console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  //   // Trying to set a email as record
  //   txn = await domainContract
  //     .connect(owner)
  //     .setRecord("crypto", "dankmaster@dank.xyz");
  //   await txn.wait();

  //   const ownerRecord = await domainContract.getRecord("crypto");
  //   console.log("%s has set record to %s", domainAddress, ownerRecord);

  //   // Trying to set a record that doesn't belong to me!
  //   txn = await domainContract
  //     .connect(randomPerson)
  //     .setRecord("crypto", "PWNED!");
  //   await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
