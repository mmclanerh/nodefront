$(function() {
    
    initHosts();
    
    // refresh every x seconds
    window.setInterval(function(){
        
        // get zabbix data
        getHostData(function(data){
            updateHostsUI(data);
        });
        
        getTriggerData(function(data){
            updateTriggersUI(data);
        });
        
    }, 10000);
    
    // ########################################################################### HOSTS
    
    function initHosts() {
        
        // init html for number of hosts in the data object
        var data = getHostData(function(data) {
            //console.log(data);
            // init the containers for the hosts
            var hosts = [];
            
            $.each( data, function( key, val ) {
                
                // init mustache templates with values.
                var template = $('#newrelic_host_template').html();
                Mustache.parse(template); // optional, speeds up future uses
                var rendered = Mustache.render(template, {
                    host_id: val.host_id, 
                    hostname: val.hostname, 
                    cpu: val.cpu,
                    mem: val.memory_usage_percentage,
                    dsk: val.disk_usage_percentage,
                    health_status : val.health_status 
                });
                //$('#container').append(rendered);
                hosts.push(rendered);
            });
            
            slide(hosts, 12);
            // update UI
            updateHostsUI(data);
            
        });
    };
    
    // update all data for every hosts that was initialized.
    // TODO
    // Need to do this more fancy!
    function updateHostsUI(data){
        
        // reset ui first
        $("li").removeClass('active');
        
        var items = [];
        
        $.each( data, function( key, val ) {
            // get ID for html item
            var hostId = val.host_id;
            
            // CPU ####################
            
            // set cpu value
            $("#data_"+hostId+" .cpu .value").html(val.cpu + "%");
            // set cpu bars
            $("#data_"+hostId+" .cpu ul li:nth-last-child("+(val.bars_cpu+1)+")").nextAll().addClass('active');
            
            // MEM ####################
            
            // set memory value
            $("#data_"+hostId+" .mem .value").html(val.memory_usage_percentage + "%");
            // set memory bars
            $("#data_"+hostId+" .mem ul li:nth-last-child("+(val.bars_mem+1)+")").nextAll().addClass('active');
            
            // DSK ####################
            // set disk value
            $("#data_"+hostId+" .dsk .value").html(val.disk_usage_percentage + "%");
            // set disk bars
            $("#data_"+hostId+" .dsk ul li:nth-last-child("+(val.bars_disk+1)+")").nextAll().addClass('active');
            
            // HEALTH status ####################
            // set status
            $("#data_"+hostId+" .health").html(val.health_status);
        });
        
    };
    
    function getHostData(callback){
        
        $('#refresh').fadeIn();
        $.getJSON( "/new_relic/hostdata", function( data ) {
            callback(data);
            $('#refresh').fadeOut();
        });
    };
    
    // ########################################################################### TRIGGERS
    
    // update all data for every hosts that was initialized.
    function updateTriggersUI(data){
        // init html for the trigger
        var type = '';

        $('ul.trigger_list').html("");

        // init the containers for the hosts
        $.each( data, function( key, val ) {

            if (val.title.indexOf("downtime") != -1) {
                type = 'downtime'
            } else if (val.title.indexOf("criticalalert") != -1) {
                type = 'criticalalert'
            } else if (val.title.indexOf("caution") != -1) {
                type = 'caution'
            } else if (val.title.indexOf("deployment") != -1) {
                type = 'deployment'
            }
            $('ul.trigger_list').append('<li class='+ type +'>'+'<span>'+val.title+'</span>'+val.pubDate+'</li>');
        });        
    }
    
    function getTriggerData(callback){
        
        $('#refresh').fadeIn();
        $.getJSON( "/new_relic/triggerdata", function( data ) {
            callback(data);
            $('#refresh').fadeOut();
        });
    };
    
});