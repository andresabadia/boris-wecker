<template>
  <div class="settings">
    <h1> Settings</h1>
    <br>
    <!-- <div>Active: {{alarm.active}}</div> -->
    <div class="active-status">
      <input type="checkbox" v-model="alarm.active">
      <span @click="alarm.active=!alarm.active">{{alarm.name}}</span>
    </div>

    <!-- <div>Name: {{alarm.name}}</div>
    <div>Repetition State: {{alarm.repetition.state}}</div>
    <div>Repetition Time: {{alarm.repetition.time.hours}}:{{alarm.repetition.time.minutes}}</div>
    <div>Repetition Days: {{alarm.repetition.weekdays}}</div>
    <div>No Repetition Date: {{alarm.repetition.date}}</div> -->
    <div class="wecker-plan">
      <h6>Weckerplan</h6>
      <span>Weckername</span>
      <input type="text" v-model="alarm.name">
      <br>
      <span>Wann soll der Wecker klingeln</span>
      <br>
      <input type="radio" :value=false v-model="alarm.repetition.state">
      <span @click="alarm.repetition.state=false">Einmal</span>
      <span class="radio-space"></span>
      <input type="radio" :value=true v-model="alarm.repetition.state">
      <span @click="alarm.repetition.state=true">Regelmäßig</span>
      <br>
      <input type="number" min="0" max="23" style="text-align: right;" v-model="alarm.repetition.time.hours">
      <span> : </span>
      <input type="number" min="0" max="59" v-model="alarm.repetition.time.minutes">
      <span> Uhr</span>
      <div class="repetition" v-if="alarm.repetition.state">
        <input type="checkbox"  v-model="mon"><span>Mo.</span>
        <input type="checkbox"  v-model="tue"><span>Di.</span>
        <input type="checkbox"  v-model="wed"><span>Mi.</span>
        <input type="checkbox"  v-model="thu"><span>Do.</span>
        <input type="checkbox"  v-model="fri"><span>Fr.</span>
        <input type="checkbox"  v-model="sat"><span>Sa.</span>
        <input type="checkbox"  v-model="sun"><span>So.</span>
      </div>
      <div class="no-repetition" v-else>
        <input type="date" v-model="alarm.repetition.date">
      </div>
    </div>

    <!-- <div v-for="(vorgang) in alarm.vorgangs" :key="vorgang.name">
      <div>Vorgang: {{vorgang}}</div>
    </div> -->
    <div class="vorgang-settings">
      <h6>Vorgang</h6>
      <span>Vorgangsname</span>
      <input type="text" v-model="alarm.vorgangs[vorgangIndex].name">
      <br>
      <span>Vorgangsdauer</span>
      <input type="number" v-model="alarm.vorgangs[vorgangIndex].duration">
      <span> Min.</span>
      <br>
      <button @click="changePosition(alarm.vorgangs, vorgangIndex, vorgangIndex-1, true)"><i class="fas fa-exchange-alt"></i></button>
      <button @click="nextVorgang(alarm.vorgangs, -1)"><i class="fas fa-caret-left"></i></button>
      <button @click="addVorgang()"><i class="fas fa-plus"></i></button>
      <button @click="removeVorgang()"><i class="fas fa-minus"></i></button>
      <button @click="nextVorgang(alarm.vorgangs, +1)"><i class="fas fa-caret-right"></i></button>
      <button @click="changePosition(alarm.vorgangs, vorgangIndex, vorgangIndex+1, true)"><i class="fas fa-exchange-alt"></i></button>
      <br>
      <div class="vorgang-image-preview">
        <img :src="'./images/'+alarm.vorgangs[vorgangIndex].image" @click="selectionModal=true; selectionImage=true">
      </div>
      <button @click="selectionModal=true; selectionImage=true"><i class="fas fa-image"></i></button>
      <button @click="selectionModal=true; selectionSongs=true"><i class="fas fa-music"></i></button>
    </div>
    <div class="vorgang-parent-parent">
      <div class="vorgang-parent">               
        <div class="vorgang" v-for="(vorgang, index) in alarm.vorgangs" :key="vorgang.id" :class="{'vorgang-active':vorgang.active}" @click="vorgangIndex=index; activeVorgang()">
          {{vorgang.name}}
          <br> {{vorgang.duration}} min.
        </div> 
      </div>                
    </div>
    <div>
      <button @click="saveLocal"><i class="fas fa-save"></i></button>
    </div>

    <div class="selection-modal" v-if="selectionModal">
      <div class="selection-window">
        <div class="selection-window-close" @click="selectionModal=false; selectionSongs=false; selectionImage=false">
          <span >X</span>
        </div>
        <div class="image-selection" v-if="selectionImage">
          <div v-for="(image) in images" class="image-preview" :key="image.path">
            <img :src="'./images/'+image.path" @click="alarm.vorgangs[vorgangIndex].image=image.path; selectionModal=false; selectionSongs=false; selectionImage=false">
          </div>
        </div>

        <div class="songs-selection" v-if="selectionSongs">
          <div class="songs-available">
            <div class="song-available" v-for="(song) in songs" :key="song.path">
              <button @click="alarm.vorgangs[vorgangIndex].songs.push(song.path)"><i class="fas fa-angle-double-right"></i></button>
              <span>{{song.name}}</span>
              <audio :src="'./audio/'+song.path" controls></audio>
            </div>
          </div>
          <div class="songs-selected">
            <transition-group name="re-order" tag="span">
              <div class="song-selected re-order-item" v-for="(song, index) in alarm.vorgangs[vorgangIndex].songs" :key="index">
                <button @click="changePosition(alarm.vorgangs[vorgangIndex].songs, index, index-1)"><i class="fas fa-caret-up"></i></button>
                <button @click="changePosition(alarm.vorgangs[vorgangIndex].songs, index, index+1)"><i class="fas fa-caret-down"></i></button>
                <span>{{song | songName}}</span>
                <button @click="alarm.vorgangs[vorgangIndex].songs.splice(index, 1)"><i class="fas fa-minus"></i></button>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import newVorgang from '../assets/newVorgang.json'
import songsJSON from '../assets/songs.json'
import imagesJSON from '../assets/images.json'
export default {
  name: 'settings',
  data(){
    return{
      alarm:'',
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      vorgangIndex: 0,
      selectionModal: false,
      selectionImage: false,
      selectionSongs: false,
      songs: songsJSON.songs,
      images: imagesJSON.images
    }
  },
  watch:{
    time: function(val){
      let h,m,t
      t = val.split(':')
      h=t[0]
      m=t[1]
      this.alarm.repetition.time.hours = h
      this.alarm.repetition.time.minutes = m
    },
    mon: function(val){
      this.setWeekdaysArray(val, 1)
    },
    tue: function(val){
      this.setWeekdaysArray(val, 2)
    },
    wed: function(val){
      this.setWeekdaysArray(val, 3)
    },
    thu: function(val){
      this.setWeekdaysArray(val, 4)
    },
    fri: function(val){
      this.setWeekdaysArray(val, 5)
    },
    sat: function(val){
      this.setWeekdaysArray(val, 6)
    },
    sun: function(val){
      this.setWeekdaysArray(val, 0)
    }
    // vorgangIndex: function(val){
    //   if (val<0){
    //     this.vorgangIndex = this.alarm.vorgangs.length
    //     console.log('yes', this.vorgangIndex)
    //   }
    // }
  },
  methods:{
    setWeekdays(){
      if(this.alarm.repetition.weekdays.includes(0)){ this.son = true }
      if(this.alarm.repetition.weekdays.includes(1)){ this.mon = true }
      if(this.alarm.repetition.weekdays.includes(2)){ this.tue = true }
      if(this.alarm.repetition.weekdays.includes(3)){ this.wed = true }
      if(this.alarm.repetition.weekdays.includes(4)){ this.thu = true }
      if(this.alarm.repetition.weekdays.includes(5)){ this.fri = true }
      if(this.alarm.repetition.weekdays.includes(6)){ this.sat = true }
    },
    setWeekdaysArray(val, day){
      if(val){
        if(!this.alarm.repetition.weekdays.includes(day)){
          this.alarm.repetition.weekdays.push(day)
          this.alarm.repetition.weekdays.sort()
        }
      } else {
        this.alarm.repetition.weekdays.splice(this.alarm.repetition.weekdays.indexOf(day),1)
      }
    },
    nextVorgang(array, add){
      if(this.vorgangIndex + add < 0){
        this.vorgangIndex = array.length -1
      } else if(this.vorgangIndex + add >= array.length){
        this.vorgangIndex = 0
      } else {
        this.vorgangIndex += add
      }
      this.activeVorgang()
    },
    addVorgang(){
      let newV = newVorgang.vorgang
      this.alarm.vorgangs.splice(this.vorgangIndex, 0, {
        "id":"id",
        "name": "New",
        "duration": 1,
        "songs": [],
        "image": "",
        "active": false
      })
      this.alarm.vorgangs[this.vorgangIndex].id = this.makeUniqueID()
      this.activeVorgang()
    },
    removeVorgang(){
      if(this.vorgangIndex + 1 == this.alarm.vorgangs.length){
        this.vorgangIndex--
        this.alarm.vorgangs.splice(this.vorgangIndex + 1,1)
      } else {
        this.alarm.vorgangs.splice(this.vorgangIndex,1)
      }
      this.activeVorgang()
    },
    activeVorgang(set){
      if(set==undefined){set=true}
      for (let i = 0; i < this.alarm.vorgangs.length; i++){
        this.alarm.vorgangs[i].active = false
      }
      if(set){
        this.alarm.vorgangs[this.vorgangIndex].active = true
      }
    },
    changePosition(array, from, to, next){
      if(next==undefined){
        next=false
      }
      let tmp
      if(to < 0){
        console.log("already in the first position")
      } else if (to >= array.length){
        console.log("already in the last position")
      } else {
        tmp = array[from]
        array.splice(from, 1, array[to])
        array.splice(to, 1, tmp)  
        if(next){
          this.nextVorgang(array, to-from)
        }
      }
    },
    playPreview(event){
      console.log(event.target.previousElementSibling)
      event.target.previousElementSibling.play()
    },
    saveLocal(){
      localStorage.setItem('bw-alarm', JSON.stringify(this.alarm))
      // this.$store.commit('userData', this.alarm)
      let user = JSON.parse(localStorage.getItem('bw-user'))

      // console.log(this.alarm)
      
      for(let i=0; i<user.data.alarms.length; i++){
        if(user.data.alarms[i].id == this.alarm.id){
          // console.log(user.data.alarms[i])
          user.data.alarms[i] = this.alarm
          // console.log(user.data.alarms[i])
          localStorage.setItem('bw-user', JSON.stringify(user))
          console.log(this.$store.getters.user)
          this.$store.commit('user', user)
          console.log(this.$store.getters.user)
          return
        }
      }
    },
    makeUniqueID(){
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 8; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text + new Date().getTime().toString(36);
    }
  },
  created(){
    this.alarm = JSON.parse(localStorage.getItem('bw-alarm'))
    this.setWeekdays()
    this.activeVorgang()
  },
  beforeRouteLeave (to, from, next) {
    this.activeVorgang(false)
    this.saveLocal()
    next()
  },
  beforeRouteEnter(to, from, next){
    //check if alarmId exist
    if (localStorage.getItem('bw-alarm')!=null){
      next();
    } else {
      next(false);
    }
  },
  filters:{
    songName: val=>{
      let songs = songsJSON.songs
      for (let i = 0; i < songs.length; i++){
        if(songs[i].path == val){
          return songs[i].name
        }
      }
    }
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .settings{
    position: relative;
    margin-left: 400px;
    text-align: left;
  }
  .active-status, .wecker-plan, .vorgang-settings{
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    margin-bottom: 20px;
    padding: 5px 0 5px 20px;
  }
  .active-status{
    width: 250px;
  }
  .active-status input{
    margin-right: 10px;
  }
  .wecker-plan, .vorgang-settings{
    width: 500px;
  }
  .wecker-plan input[type="text"], .vorgang-settings input{
    margin-left:10px;
  }
  .wecker-plan input[type="radio"]{
    margin-right:5px;
  }
  .radio-space{
    margin: 10px;
  }
  .vorgang-image-preview{
    height: 250px;
    width: 250px;
  }
  .vorgang-image-preview img{
    max-width: 250px;
    max-height: 250px;
  }
  .selection-modal{
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
  .selection-window{
    display: flex;
    background-color: #42426b;
    width:1300px;
    height: 726px;
    position: relative;
  }
  .selection-window-close{
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
  .songs-selection{
    display: flex;
    width: 100%;
    padding: 20px;
    overflow: auto;
  }
  .songs-available, .songs-selected{
    width: 50%;
  }
  .song-available, .song-selected{
    display: flex;
    align-items: center;
    margin: 10px 0px;
  }
  .song-available span, .song-selected span{
    margin: 0px 10px;
  }
  .re-order-move{
    transition: all .5s;
  }
  .re-order-item{
    transition: all 1s;
    display: block;
  }
  .re-order-enter-active{
    transition: all 0.5s;
  }
  .re-order-leave-active {
    transition: all 0.5s;
  }  
  .re-order-enter{
    opacity: 0;
    transform: translateX(-60px)
  } 
  .re-order-leave-to {
    opacity: 0;
    transform: translateY(60px);
  }
  .re-order-leave-active {
    position: absolute;
  }    
  
  .image-selection{
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    overflow: auto;
  }
  .image-preview{
    padding: 10px
  }
  .image-preview img{
    max-height: 300px;
    max-width: 300px;
  }

  .vorgang-parent-parent{
    position: relative;
    width: 80%;
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
