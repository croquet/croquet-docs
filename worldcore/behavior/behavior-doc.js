
/**
 * Extends an actor to use behaviors.
 * @public
 * @worldcoremixin
 */
class AM_Behavioral {
  /**
   * Sets the actor's top-level behavior. Usually this is only done during the actor's `init()` routine. The actor
   * only has one top level behavior. Starting a new behavior will delete the previous one.
   * @public
   * @param {Behavior} behavior - The actor's top-level behavior
   * @param {Object={}} options - An optional options object.
   * @example
   * init(options) {
     super.init(options);
     this.startBehavior(MyTopLevelBehavior);
     }
   */
  startBehavior(behavior, options = {}) {}
}

class Behavior { }

class CompositeBehavior {}

class SequenceBehavior {}

class RandomSequenceBehavior {}

class ParallelSequenceBehavior {}

class SelectorBehavior {}

class RandomSelectorBehavior {}

class ParallelSelectorBehavior {}

class DecoratorBehavior {}

class InvertBehavior {}

class SucceedBehavior {}

class FailBehavior {}

class LoopBehavior {}

class DestroyBehavior {}

class DelayBehavior {}