class MusicManager{
    curSong;
    curSongName;

    constructor(){
        this.curSong = null;
        this.curSongName = "";
    }

    StopSong(){
        if(this.curSong != null && this.curSong.isPlaying){
            this.curSong.stop();
        }
    }

    PlaySong(songName)
    {
        //If we try to play the same song, don't restart it
        if(this.curSongName == songName)
        {
            return;
        }

        this.StopSong();

        this.curSong = globalScene.sound.add(songName);
        this.curSong.loop = true;
        this.curSong.play();
        this.curSongName = songName;
    }

    PlaySfx(sfxName)
    {
        globalScene.sound.add(sfxName).play();
    }
}