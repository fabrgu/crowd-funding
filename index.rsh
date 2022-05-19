'reach 0.1';

const [ isProjectState, ONGOING, COMPLETE ] = makeEnum(2);

const DeployerInteract = {
  getAmountNeeded: Fun([], UInt),
  getDeadLine: Fun([], UInt),
  ready: Fun([], Null)
}

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
    ...DeployerInteract,
  });
  const Funder = Participant('Funder', {
    ...Project,
    amountToFund: UInt,
  });
  init();
  
  Creator.only(() => {
    // const projectName = declassify(interact.projectName);
    // const amountNeeded = declassify(interact.amountNeeded);
    // const duration = declassify(interact.duration);
    const amountNeeded = declassify(interact.getAmountNeeded());
    const projectDeadLine = declassify(interact.getDeadLine());
    const deployerAddress = this;
  });
  // Creator.publish(projectName, amountNeeded, duration);
  Creator.publish(amountNeeded, projectDeadLine, deployerAddress);
  commit();

  // Creator.publish();
  Creator.interact.ready();
  // The second one to publish always attaches
  Funder.only(() => {
    const amountToFund = declassify(interact.amountToFund);
  });
  Funder.publish(amountToFund);
  commit();
  // write your program here
  exit();
});
