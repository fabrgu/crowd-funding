'reach 0.1';

const [ isProjectState, ONGOING, COMPLETE ] = makeEnum(2);

const Project = {
  ...hasRandom,
  getProjectState: Fun([], UInt),
  getAmountFunded: Fun([], UInt),
  getDuration: Fun([], UInt),
  getAmountNeeded: Fun([], UInt),
};

export const main = Reach.App(() => {
  const Creator = Participant('Creator', {
    ...Project,
    deadline: UInt, // time delta (blocks/rounds)
  });
  const Funder = Participant('Funder', {
    ...Project,
    acceptAmountToFund: Fun([UInt], Null),
  });
  init();
  
  Creator.only(() => {
    const projectName = declassify(interact.projectName);
    const description = declassify(interact.description);
    const amountNeeded = declassify(interact.amountNeeded);
    const duration = declassify(interact.duration);
  });
  Creator.publish();
  commit();
  // The second one to publish always attaches
  Funder.publish();
  commit();
  // write your program here
  exit();
});
