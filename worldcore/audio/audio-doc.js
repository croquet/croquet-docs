/**
 * The audio manager is a view-side service with the public name "AudioManager".
 * It controls playing spatial audio using the Resonance spatial audio system.
 * If you want to use the audio manager, add it as a service to your root view.
 * A pawn with the {@link PM_AudioSource} mixin can play sounds, and a pawn with the {@link PM_AudioListener} controls the position of
 * the listener.
 *
 * ```
 * class MyViewRoot extends ViewRoot {
 *   static viewServices() { return [AudioManager]; }
 * }
 * @public
 * @hideconstructor
 * @augments ViewService
 */
 class AudioManager {
}

/**
 * Provides an actor with the ability to play sounds. This actor's pawn must have the {@link PM_AudioSource} mixin.
 *
 * @public
 * @worldcoremixin
 * @example
 * class MyActor extends mix(Actor).with(AM_AudioSource) {}
 */
 class AM_AudioSource {

   /**
    * Sends a message to its pawn telling it to play a sound.
    * @public
    * @param {string} url - The url of an external sound asset.
    * @param {number} [volume=1] - The volume of the sound from 0 to 1.
    * @example
    * import mySound from "./assets/boing.mp3";
    * myActor.playSound(mySound, 0.5);
     */
   playSound(url, volume) {}

}


/**
 * Provides a pawn with an interface to the [audio manager]{@link AudioManager}. Plays a sound from the
 * pawn's actor at the pawn's current location.
 *
 * ***Note:*** In order to work properly the `PM_AudioSource` mixin should be combined with {@link PM_Spatial} or
 * one of its descendants. Its listens to {@link event:viewGlobalChanged} to update its transform.
 *
 * @public
 * @listens viewGlobalChanged
 * @worldcoremixin
 * @example
 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_AudioSource) {}
 */
 class PM_AudioSource {
 }

/**
 * Attaches the listener for the [audio manager]{@link AudioManager} to this pawn. The listener will
 * track the pawn's position. Only the pawn associated with the local player will control the listener.
 *
 * ***Note:*** If a pawn is a listener and plays a sound from itself, the sound will not be spatialized.
 *
 * ***Note:*** In order to work properly the `PM_AudioListener` mixin should used in conjunction with
 * {@link PM_Player} as well as {@link PM_Spatial} or one of its descendants.
 *
 * @public
 * @listens viewGlobalChanged
 * @listens lookGlobalChanged
 * @worldcoremixin
 * @example
 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_AudioSource, PM_AudioListener, PM_Player) {}
 */
  class PM_AudioListener {
 }