<template>
  <div class="settings">
    <h1> Settings {{ $route.params.alarmId }} </h1>
    <br><br>
    <p>Name: {{alarm.name}}</p>
    <p>Active: {{alarm.active}}</p>
    <p>--------</p>
    <p>Repetition State: {{alarm.repetition.state}}</p>
    <p>Repetition Time: {{alarm.repetition.time.hours}}:{{alarm.repetition.time.minutes}}</p>
    <p>Repetition Days: {{alarm.repetition.weekdays}}</p>
    <p>--------</p>
    <p v-for="(vorgang, index) in alarm.vorgangs">Vorgang: {{vorgang.name}} | {{vorgang.duration}} | {{vorgang.songs}} | {{vorgang.image}} </p>
    
  </div>
</template>

<script>
export default {
  name: 'settings',
  data(){
    return{
      user: {
        id: null,
        name: null,
        data: null,
        guest: null
      },
      alarm:''
    }
  },
  created(){
    this.checkUser()
    this.alarm = JSON.parse(localStorage.getItem('bw-alarm'))
  },
  beforeRouteEnter(to, from, next){
    //check if alarmId exist
    if (localStorage.getItem('bw-alarm')!=null){
      next();
    } else {
      next(false);
    }
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
