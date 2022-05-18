'reach 0.1';

const [ isProjectState, ONGOING, COMPLETE ] = makeEnum(2);

const Project = {
  ...hasRandom,
  getProjectState: Fun([], UInt),
  projectName: Bytes(500),
  description: Bytes(1000),
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
    amountToFund: UInt,
  });
  init();
  
  Creator.only(() => {
    const projectName = declassify(interact.projectName);
    const description = declassify(interact.description);
    const amountNeeded = declassify(interact.amountNeeded);
    const duration = declassify(interact.duration);
  });
  Creator.publish(projectName, description, amountNeeded, duration);
  commit();
  // The second one to publish always attaches
  Funder.only(() => {
    const amountToFund = declassify(interact.amountToFund);
  });
  Funder.publish(amountToFund);
  commit();
  // write your program here
  exit();
});
