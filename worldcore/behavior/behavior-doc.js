
/**
 * Extends an actor to use behaviors.
 * @public
 * @worldcoremixin
 * @example
 * class MyActor extends mix(Actor).with(AM_Behavioral) {}
 */
class AM_Behavioral {
  /**
   * Sets the actor's top-level behavior. Usually this is only done during the actor's `init()` routine. The actor
   * only has one top level behavior. Starting a new behavior will delete the previous one.
   * @public
   * @param {Behavior} behavior - The actor's top-level behavior
   * @param {Object} [options] - An optional options object that will be passed to the behavior when it starts
   * @example
   * init(options) {
   *    super.init(options);
   *    this.startBehavior(MyTopLevelBehavior);
   * }
   */
  startBehavior(behavior, options = {}) {}
}

/**
 * The base class for all behaviors. Create your own behaviors by deriving from this class. Important methods:
 *
 * * `init()` - Instantaneous actions when the behavior is created.
 * * `go()` - Recurring actions performed every tick.
 * * `destroy()` - Ends the behavior.
 * * `succeed()` - Ends the behavior and reports success to its parent.
 * * `fail()` - Ends the behavior and reports failure to its parent.
 *
 * @public
 * @augments WorldcoreModel
 * @hideconstructor
 */
class Behavior {
  /**
   * Called when the behavior is instantiated.
   * @public
   * @param {Object} [options] - Optional option object passed to [set()]{@link Behavior#set}
   */

  init(options) {}

     /**
    Sets one or more internal properties of the behavior. The internal name of each property will be the name of the option prefaced by "_".
    You should define corresponding getters to access these internal properties.

    *```
    class MyBehavior extends Behavior {
        get growth() {return this._growth || 0.5};
    }

    const behavior = MyBehavior.create();
    behavior.set({growth: 2});
    @public
    @param {Object}
    */
  set(options) {}

  /**
   * The actor that is running the behavior.
   * @public
   * @type {Actor}
   */
  get actor() {}

  /**
   * The parent behavior in the behavior tree.
   * @public
   * @type {Behavior}
   */
  get parent() {}

  /**
   * The tick rate in milliseconds. If a behavior doesn't return an immediate result, it
   * will run periodically at the frequency of the tick rate. If the tick rate is
   * set to 0, the behavior won't tick and won't run [do()]{@link Behavior#do}.
   * @public
   * @default 100
   * @type {number}
   */
  get tickRate() {}

  /**
   * This is where the work of the behavior actually happens. If you create your own behavior
   * overload `do`. This will be called once per tick`.
   *
   * **Note:** `do` will be called for for the first time at random interval less than the tick rate.
   * (This is to prevent actors that spawn simultaneously from all processing their behaviors at the save time.)
   * If you want something to happen instantly, put it in [init]{@link Behavior#init} instead of `do`.
   *
   * @public
   * @param {number} delta - Time in milliseconds since the last invocation of `do`.
   */
  do(delta) {}

  /**
   * Ends the behavior. Usually you want to report [succeed]{@link Behavior#succeed} or [fail]{@link Behavior#fail} instead.
   * @public
   */
  destroy() {}

  /**
   * Ends the behavior and reports that it has succeeded to its parent.
   * @public
   * @param {Object} [data] - An optional data object that will be passed to the parent behavior.
   */
  succeed(data) {}

   /**
   * Ends the behavior and reports that it has failed to its parent.
   * @public
   * @param {Object} [data] - An optional data object that will be passed to the parent behavior.
   */
  fail(data) {}
}

/**
 * Base class for parent behaviors that handle multiple children. Does not tick itself. Only
 * listens for success or failure by its children.
 * @public
 * @hideconstructor
 * @augments Behavior
 */
class CompositeBehavior {
  /**
   * The child behaviors.
   *
   * **Warning:** cannot be set using [set()]{@link Behavior#set}. Must be hard-coded into your
   * derived class.
   * @example
   * class MyCompositeBehavior extends CompositeBehavior {
   *  get behaviors() { return [ChildBehaviorA, ChildBehaviorB]; }
   * }
   * @public
   * @type {Behavior[]}
   */
     get behaviors() {}

/**
 * Starts a child behavior.
 * @public
 * @param {Behavior} behavior - The class name of the child behavior.
 * @param {Object} [options] - An optional options object to be passed to the child's `init()`.
 */
  startChild(behavior, options = {}) {}

/**
 * Called by a child from [succeed()]{@link Behavior#succeed}.
 * @public
 * @param {Behavior} child - The child that is reporting.
 * @param {Object} [data] - Optional data from child.
 */
  reportSuccess(child, data) {}

/**
 * Called by a child from [fail()]{@link Behavior#fail}.
 * @public
 * @param {Behavior} child - The child that is reporting.
 * @param {Object} [data] - Optional data from child.
 */
  reportFailure(child, data) {}
}

/**
 * Runs its child behaviors one at a time, in order. If any child behavior fails, the entire sequence fails. If they all
 * succeed, the entire sequence succeeds.
 * @public
 * @hideconstructor
 * @augments CompositeBehavior
 */
class SequenceBehavior {}

/**
 * Runs its child behaviors one at a time, in random order. If any child behavior fails, the entire sequence fails.
 * If they all succeed, the entire sequence succeeds.
 * @public
 * @hideconstructor
 * @augments CompositeBehavior
 */
class RandomSequenceBehavior {}

/**
 * Runs all of its child behaviors simultaneously. If any child fails, all the remaining children are aborted, and
 * the entire sequence fails. If they all succeed, the entire sequence succeeds
 * @public
 * @hideconstructor
 * @augments CompositeBehavior
 */
class ParallelSequenceBehavior {}

/**
 * Runs its child behaviors one at a time, in order. The first time a child succeeds, the selector also succeeds, and
 * all the remaining children are ignored. If all the children fail, then the selector also fails.
 * @public
 * @hideconstructor
 * @augments CompositeBehavior
 */
class SelectorBehavior {}

/**
 * Runs its child behaviors one at a time, in random order. The first time a child succeeds, the selector also succeeds, and
 * all the remaining children are ignored. If all the children fail, then the selector also fails.
 * @public
 * @hideconstructor
 * @augments CompositeBehavior
 */
class RandomSelectorBehavior {}

/**
 * Runs all of its child behaviors simultaneously. If any child succeeds, all the remaining children
 * are aborted and the selector succeeds. If all the children fail, then the selector also fails.
 * @hideconstructor
 * @augments CompositeBehavior
 */
class ParallelSelectorBehavior {}

/**
 * Base class for parent behaviors that handle a single child. Does not tick itself. Only
 * listens for success or failure by its child.
 * @hideconstructor
 * @public
 * @augments Behavior
 */
class DecoratorBehavior {

  /**
  *  The child behavior.
  *
  *  **Warning:** cannot be set using [set()]{@link Behavior#set}. Must be hard-coded into your
   * derived class.
   * @example
   * class MyDecoratorBehavior extends DecoratorBehavior {
   *  get behavior() { return ChildBehavior; }
   * }
  * @public
  * @type {Behavior}
  */
    get behavior() {}

/**
 * Starts the child behavior.
 * @public
 * @param {Object} [options] - An optional options object to be passed to the child's `init()`.
 */
 startChild(options = {}) {}

 /**
  * Called by the child from [succeed()]{@link Behavior#succeed}.
  * @public
  * @param {Behavior} child - The child that is reporting.
  * @param {Object} [data] - Optional data from child.
  */
   reportSuccess(child, data) {}

 /**
  * Called by the child from [fail()]{@link Behavior#fail}.
  * @public
  * @param {Behavior} child - The child that is reporting.
  * @param {Object} [data] - Optional data from child.
  */
   reportFailure(child, data) {}
}

/**
 * Inverts the output of the child. Success is reported as failure and vice versa.
 * @hideconstructor
 * @public
 * @augments DecoratorBehavior
 */
class InvertBehavior {}

/**
 * Holds a single child behavior. Always succeeds when its child finishes.
 * @hideconstructor
 * @public
 * @augments DecoratorBehavior
 */
class SucceedBehavior {}

/**
 * Holds a single child behavior. Always fails when its child finishes.
 * @hideconstructor
 * @public
 * @augments DecoratorBehavior
 */
class FailBehavior {}

/**
 * Holds a single child behavior, and runs it repeatedly
 * until it reaches a maximum count. If the child ever fails,
 * the entire behavior will fail and the loop will abort. If the child succeeds every time
 * it's run, the entire behavior will succeed when the maximum count is
 * reached.
 *
 * **Warning:** If the child completes instantly, and the count is high, you will probably overrun
* the call stack.
 * @hideconstructor
 * @public
 * @augments DecoratorBehavior
 */
class LoopBehavior {
    /**
   * The number of times the loop will repeat. If it's set to 0, it will
   * repeat indefinitely.
   * @public
   * @default 0
   * @type {number}
   */
     get count() {}
}

/**
 * Destroys the actor when it's run.
 * @hideconstructor
 * @public
 * @augments Behavior
 */
class DestroyBehavior {}

/**
 * Succeeds when delay time is reached.
 * @hideconstructor
 * @public
 * @augments Behavior
 */
class DelayBehavior {
  /**
   * Delay in milliseconds.
   * @public
   * @default 1000
   * @type {number}
   */
  get delay() {}
}
