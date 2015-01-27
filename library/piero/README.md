Piero - The Event Master 
=====

Piero is an event managment library, allowing you to bind custom events to nodes, 
and listeners to their trigers. All of which are kept track of in pieros instance.

Usage : 

```javascript
var event_circle = piero.make({
    state  : {},
    events : [
        { 
            "called"       : "somesome",
            "that_happens" : [
                { 
                    on : document.getElementById("some_node_somewhere"),
                    is : [ "click" ]
                }
            ],
            "only_if"      : function ( heard ) {
                return true
            }
        }
    ],
})
event_circle.add_listener({
    for : "somesome",
    that_does : function ( heard ) {
        // console.log( heard )
        // {
        //  state : Object,
        //  event : XMLHttpRequest
        // }
        return heard
    }
})
```