Worldcore is an entity-management system that sits on top of the Croquet SDK. It makes it easier to wrangle large numbers of 3d objects in a multiuser app.

For example, suppose you want to create a multiplayer virtual world with player-controlled avatars, AI characters, and other dynamic entities. You could build it directly on top of Croquet, but that would require a significant amount boilerplate code to ensure that every object in the model is correctly represented in the view.

Worldcore eliminates much of that complexity with its actor/pawn system. An actor is a type of model that automatically instantiates a matching pawn in the view when its created. This means you can focus on what the actor does, and how the pawn looks, without having to worry about how they communicate with each other.

Actors and pawns can be modularly extended with mixins to give them additional methods and properties. Mixins can also register actors and pawns with services. Services are global objects in the model or the view that provide shared functionality like rendering or collision detection.

