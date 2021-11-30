Worldcore Behavior is a behavior tree scripting tool for Worldcore.

Behavior trees are a hierarchical data structure for encoding AI behavior. Each
node in the tree has three possible states that it can report to the the node above it:

* Running
* Success
* Failure

A variety of composite nodes implement different behavior patterns based on the state
of their child nodes. For example, a Selector node can try a bunch of behaviors in
order, only returning a success when one succeeds. While a Sequence node requires all
of its children to successfully complete one after another. Multiple children
can run simultaneously, allowing parallel behaviors, or "first past the gate" selection.

[Wikipedia Article]{@link https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control)}


