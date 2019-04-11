<template>
  <div class="home">
    <div class="row justify-content-md-center">
      <div class="col-md-6 col-lg-4">
        <ul class="list-group">
          <li class="list-group-item" v-for="(alarm, index) in $store.getters.user.data.alarms"> {{alarm.name}} - {{alarm.repetition.time.hours | time}}:{{alarm.repetition.time.minutes | time}} Uhr<i class="fas fa-cog" @click="settings(alarm.id, index)"></i><i class="fas fa-play" @click="player(alarm.id, index)"></i> </li>
        </ul>
        <br>
        <!-- <div>Nächster Wecker in: {{nextAlarmVar[0].alarmDate - today | DateToTime}} - {{user.data.alarms[nextAlarmVar[0].index].name}}</div> -->
        <div>Nächster Wecker in: {{nextAlarmVar[0].alarmDate - today | DateToTime}} - {{$store.getters.user.data.alarms[nextAlarmVar[0].index].name}}</div>
      </div>
    </div>    
  </div>
</template>

<script>
import defaultJSON from '../assets/alarms.json'
import { setTimeout } from 'timers';
import { close } from 'fs';
export default {
  name: 'home',
  data(){
    return{
      // user: {
      //   id: null,
      //   name: null,
      //   data: null,
      //   guest: null
      // },
      nextAlarmVar: [],
      today:null,
      countDownTimeout: null
    }
  },
  methods:{
    settings(alarmId, index){
      localStorage.setItem('bw-alarm', JSON.stringify(this.$store.getters.user.data.alarms[index]))
      // localStorage.setItem('bw-alarm', JSON.stringify(this.user.data.alarms[index]))
      this.$router.push('settings')
    },
    player(alarmId, index){
      localStorage.setItem('bw-alarm', JSON.stringify(this.$store.getters.user.data.alarms[index]))
      this.$router.push('player')
    },
    nextAlarm(){
      let alarms = this.$store.getters.user.data.alarms
      for(let i = 0; i < alarms.length; i++){
        if(alarms[i].active){
          let alarmDate
          let rep = alarms[i].repetition
          if(rep.state){
            let now = new Date()
            alarmDate = new Date(now)
            alarmDate.setHours(rep.time.hours)
            alarmDate.setMinutes(rep.time.minutes)
            alarmDate.setSeconds(0)
            alarmDate.setMilliseconds(0)
            if(rep.weekdays.length>0){              
              if (now > alarmDate){ 
                alarmDate.setDate(alarmDate.getDate()+1)
              }
              while(!rep.weekdays.includes(alarmDate.getDay())){
                alarmDate.setDate(alarmDate.getDate()+1)
              }

            }
          }else{
            alarmDate = new Date(rep.date.getFullYear(), rep.date.getMonth(), rep.date.getDate(), rep.time.hours, rep.time.minutes)
          }
          console.log('next alarm: ' + alarmDate)
          this.nextAlarmVar.push({alarmId: alarms[i].id, index: i, alarmDate: alarmDate})
        }
      }
      if(this.nextAlarmVar.length > 1){
        this.nextAlarmVar.sort((a,b)=>{
          return a.alarmDate - b.alarmDate
        })
        this.startCountDown()
      }
      
    },
    startCountDown(){
      if(this.nextAlarmVar != []){
        console.log(this.nextAlarmVar[0].alarmDate - this.today)
        this.countDownTimeout = setTimeout(()=>{this.player(this.nextAlarmVar[0].alarmId,this.nextAlarmVar[0].index)},this.nextAlarmVar[0].alarmDate - this.today)
      }      
    },
    startTime(){
      this.today = new Date()
      setTimeout(this.startTime, 500)         
    },
    updateLocal(){
      localStorage.setItem('bw-user', JSON.stringify(this.$store.getters.user))
      // localStorage.setItem('bw-user', JSON.stringify(this.user))
    },
    setDefaultUser(){
      // this.$store.state.user.id = this.makeUniqueID
      // this.$store.state.user.name = 'guest'
      // this.$store.state.user.data = defaultJSON
      // this.$store.state.user.guest = true

      this.$store.commit('userId', this.makeUniqueID)
      this.$store.commit('userName', 'guest')
      this.$store.commit('userData', defaultJSON)
      this.$store.commit('userGuest', true)
      console.log(this.$store.getters.user)

      // this.user.id = this.makeUniqueID
      // this.user.name = 'guest'
      // this.user.data = defaultJSON
      // this.user.guest = true
    },
    checkUser(){
      if (localStorage.getItem('bw-user')!=null){
        this.$store.commit('user', JSON.parse(localStorage.getItem('bw-user')))
      } else {
        this.setDefaultUser()
        this.updateLocal()
      }      
    }
  },
  beforeRouteEnter(to, from, next){
    //clear alarms
    if (true){
      localStorage.removeItem('bw-alarm')
      next()
    } else {
      next(false)
    }
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.countDownTimeout)
    next()
  },
  created(){
    this.checkUser()
    this.startTime()
    this.nextAlarm()
  },
  filters: {
    DateToTime:(value)=>{
      let t, h, m, s
      t = Math.floor(value / (1000 * 60 * 60 * 24))
      h = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      m = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60))
      s = Math.floor((value % (1000 * 60)) / 1000)
      // if (value < 10) {
      //     value = "0" + value
      // }
      return t + 'T:' + h  + ':' + m + ':' + s
    },
    time:(value)=>{
      if (value < 10) {
        value = "0" + value
      }
      return value
    }
  },
  computed:{
    makeUniqueID(){
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text + new Date().getTime().toString(36);
    }
  }
}
</script>

<style scoped>
.fas{  
    margin: 0 10px;
    float: right;
    cursor: pointer;
}
</style>


