'reach 0.1';

const [ isProjectState, ONGOING, COMPLETE ] = makeEnum(2);

const Project = {
  ...hasRandom,
  getProjectState: Fun([], UInt),
  projectName: Bytes(500),
  amountNeeded: UInt,
  duration: UInt, // time delta (blocks/rounds)
  amountFunded: UInt,
};

export const main = Reach.App(() => {
  const Creator = Participant('Creator', {
    ...Project,
  });
  const Funder = Participant('Funder', {
    ...Project,
    acceptAmountToFund: Fun([Bytes(500), UInt, UInt], UInt),
  });
  init();

  Creator.only(() => {
    const projectName = declassify(interact.projectName);
    const amountNeeded = declassify(interact.amountNeeded);
    const duration = declassify(interact.duration);
  });
  Creator.publish(projectName, amountNeeded, duration);
  commit();

  // The second one to publish always attaches
  // var amountFunded = 0;
  // invariant( balance() <= amountNeeded );
  // while ( amountFunded < amountNeeded && balance() < amountNeeded )  {
  //   commit();
  //   Funder.only(() => {
  //     const amountToFund = declassify(interact.acceptAmountToFund(projectName, amountNeeded, amountFunded));
  //   });
  //   Funder.publish(amountToFund).pay(amountToFund);
  //   // commit();
  //   amountFunded = amountFunded + amountToFund;
  //   continue;
  // }
  // commit();
  Funder.only(() => {
    const amountFunded = 0;
    const amountToFund = declassify(interact.acceptAmountToFund(projectName, amountNeeded, amountFunded));
  });
  Funder.publish(amountToFund).pay(amountToFund);

  commit();
  Creator.publish();
  transfer(balance()).to(balance() == amountNeeded ? Creator : Funder);
  commit();
  exit();
});
