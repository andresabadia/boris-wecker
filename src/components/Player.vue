<template>
  <div>
    <h1 class="display-1">Boris Player</h1>
    <h1> {{vorgang}} ({{duration}} min.) - {{countdown}} </h1>
    <audio id="boris-player" src="./audio/song_default.mp3" controls @ended="playNext"></audio>
    <div class="row"> {{ songs }}  </div>  
    <button class="btn btn-primary" @click="restart">Restart</button>
    <button class="btn btn-primary" @click="nextVorgang">nächste Vorgang</button>
    <button class="btn btn-primary" @click="close">Close</button>
    
    <div class="boris-player-modal">
        <div class="boris-player-window">
            <div class="boris-player-window-close" @click="close">
                <button class="btn btn-primary" @click="restart">Restart</button>
                <button class="btn btn-primary" @click="nextVorgang">nächste Vorgang</button>
                <button class="btn btn-primary" @click="close">Close</button></div>
            <div class="vorgang-inhalt-parent">
                <div class="vorgang-inhalt">
                    <h1> {{vorgang}} </h1>
                    <p>Du hast noch:</p>
                    <span style="font-size: 150px"> {{countdown}} </span>                    
                </div>
                <div class="vorgang-bild">
                    <img :src="'./images/'+vorgangs[currentVorgang].image">
                </div>
            </div>
             <div class="vorgang-parent-parent">
                <div class="wecker-name">Weckername / Zielzeit</div>
                <div class="vorgang-parent">               
                    <div class="vorgang" v-for="vorgang in vorgangs" :key="vorgang.name" :class="{'vorgang-active':vorgang.active}">
                        {{vorgang.name}}
                        <br> {{vorgang.duration}} min.
                    </div> 
                </div>                
            </div>
        </div>
    </div>
        
  </div>
</template>
<script>
export default {
    data(){
        return{
            vorgangs:[
                {
                    name: 'schlummern',
                    duration: 10,
                    songs:[],
                    active:false,
                    image: "img_01.gif"
                },
                {
                    name: 'aufstehen',
                    duration: 10,
                    songs:[ 
                        'song_02.mp3',
                        'song_03.mp3',
                        'song_04.mp3',
                        'song_05.mp3',
                    ],
                    active:false,
                    image: "img_05.gif"
                },
                {
                    name: 'duschen',
                    duration: 5,
                    songs:[ 
                        'song_02.mp3',
                        'song_03.mp3',
                    ],
                    active:false,
                    image: "img_04.gif"
                },
                {
                    name: 'frühstücken',
                    duration: 3,
                    songs:[ 
                        'song_02.mp3',
                        'song_03.mp3',
                        'song_04.mp3',
                        'song_05.mp3',                        
                        'song_03.mp3',
                        'song_04.mp3',
                    ],
                    active:false,
                    image: "img_03.gif"
                },
                {
                    name: 'zähne putzen',
                    duration: 15,
                    songs:[],
                    active:false,
                    image: "img_02.gif"
                }
            ],
            currentVorgang: 0,
            currentSong: 0,
            songDefault: 'song_default.mp3',
            vorgangTimeout: null,
            vorgangInterval: null,
            countdown:0,
            weckerTimeout: null
        }
    },
    created(){
        this.vorgangs = JSON.parse(localStorage.getItem('bw-alarm')).vorgangs
    },
    beforeRouteEnter(to, from, next){
        //check if alarmId exist
        if (localStorage.getItem('bw-alarm')!=null){
            next();
        } else {
            next(false);
        }
    },
    beforeRouteLeave (to, from, next) {
        this.clearBeforeLeave()
        next()
    },
    mounted(){
        this.playerAdmin()
    },
    methods:{
        restart(){
            this.close()
            this.playerAdmin()
        },
        playerAdmin(){
            this.vorgangs[this.currentVorgang].active = true
            if (this.currentVorgang == 0){
                this.weckerTimer()
            }
            this.vorgangTimer(this.durationMilli)
            if(this.songs.length>0){
                this.player(this.songs[0])
            } else {
                this.player()
            }
        },
        player(source){            
            if(typeof source === 'undefined'){
                source = this.songDefault
            }
            this.test=source
            let borisPlayer = document.getElementById('boris-player')
            borisPlayer.src = './audio/' + source
            borisPlayer.volume = 1
            borisPlayer.load()
            borisPlayer.play()
        },
        playNext(){
            this.currentSong++
            if(this.currentSong >= this.songs.length){
                this.player()
            } else {
                this.player(this.songs[this.currentSong])
            }
        },
        nextVorgang(){
            this.vorgangs[this.currentVorgang].active = false 
            this.currentVorgang++
            if (this.currentVorgang >= this.vorgangs.length){
                this.currentVorgang--
                this.close()
            }
            this.currentSong=0
            this.playerAdmin()
        },
        vorgangTimer(duration){
            clearInterval(this.vorgangInterval)

            this.vorgangTimeout = setTimeout(()=>{
                this.nextVorgang()
            }, duration)
            console.log("vorgangTimer: set vorgangTimeout " + duration)

            let countdown = duration
            let intervalDuration = 250
            this.vorgangInterval = setInterval(()=>{
                countdown -= intervalDuration           
                this.countdown = this.minAndSec(countdown)
            }, intervalDuration)
            console.log("vorgangTimer: set vorgangInterval")

        },
        weckerTimer(){
            this.weckerTimeout = setTimeout(()=>{
                // this.clearBeforeLeave()
                this.close()
            }, this.durationSum)
            console.log("weckerTimer: set weckerTimeout " + this.durationSum)
        },
        close(){   
            // this.clearBeforeLeave()         
            this.$router.go('-1')
        },
        clearBeforeLeave(){
            this.vorgangs[this.currentVorgang].active = false
            clearTimeout(this.weckerTimeout)
            console.log("clearBeforeLeave: weckerTimeout cleared")
            clearTimeout(this.vorgangTimeout)
            console.log("clearBeforeLeave: vorgangTimeout cleared")
            clearInterval(this.vorgangInterval)
            console.log("clearBeforeLeave: vorgangInterval cleared")
            this.currentVorgang=0
            this.currentSong=0
            let borisPlayer = document.getElementById('boris-player')
            if (borisPlayer!=null){
                borisPlayer.pause()
            }
            
        },
        minAndSec(milli){
            let min = Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60));
            let sec = Math.floor((milli % (1000 * 60)) / 1000);
            return min + ':' + sec
        }
    },
    computed:{
        songs(){ return this.vorgangs[this.currentVorgang].songs },
        vorgang(){ return this.vorgangs[this.currentVorgang].name },
        duration(){ return this.vorgangs[this.currentVorgang].duration},
        durationMilli(){ return this.vorgangs[this.currentVorgang].duration*1*1000},
        durationSum(){
            let sum = 0
            for(let i=0; i<this.vorgangs.length; i++){
                sum += this.vorgangs[i].duration
            }
            return sum*1*1000
        }
    }
}
</script>

<style scoped>
.boris-player-modal{
    color:#ff9900;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #0000004a;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.boris-player-window{
    background-color: #42426b;
    width:1300px;
    height: 726px;
    position: relative;
}
.boris-player-window-close{
    position: absolute;
    top: 0;
    right: 0;
    height: 22px;
    width: 22px;
    background-color: blue;
    text-align: center;
    color: white;
    cursor: pointer;
}
.vorgang-inhalt-parent{
    padding: 66px 44px 0px 44px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
}
.vorgang-inhalt{
    padding-left: 66px;
}
.vorgang-bild{
    width: 806px;
    height: 453px;
    background-color: white;
}
.vorgang-bild img{
    max-width: 806px;
    max-height: 453px;
}
.vorgang-parent-parent{
    position: absolute;
    width: 100%;
    bottom: 0;
}
.wecker-name{
    padding: 11px 22px 
}
.vorgang-parent{
    display: flex;
    align-items: stretch;
}
.vorgang{
    color: #919191;
    background: #3d3d3d;
    margin: 2px;
    flex-grow: 1;
    text-align: center;
    padding: 16px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.2
}
.vorgang-active{
    color:#ececec;
    background-color: #ff9306;
    box-shadow: 1px 1px 2px white, 0 0 25px #fdd551, 0 0 5px #ffb100;
}

</style>