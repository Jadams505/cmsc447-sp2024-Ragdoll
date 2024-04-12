class MusicManager{
    curSong;

    constructor(){
        this.curSong = null;
    }

    StopSong(){
        if(this.curSong != null && this.curSong.isPlaying){
            this.curSong.stop();
        }
    }

    PlaySong(songName)
    {
        this.stopSong();

        this.curSong = globalScene.sound.add(songName).play();
    }

    PlaySfx(sfxName)
    {
        globalScene.sound.add(sfxName).play();
    }
}