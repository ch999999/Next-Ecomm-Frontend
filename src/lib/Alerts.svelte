<script>
    import { alerts } from "../utils/alerts";
    import { afterNavigate } from "$app/navigation"
  
    let alertType = null
    let alertMessage = null
  
    // setting our local alertType and alertMessage whenever alerts.setAlert is called
    $: if ($alerts.type && $alerts.message) {
        alertType = $alerts.type
        alertMessage = $alerts.message
    }
  
    // reset
    function resetAlerts() {
      if ($alerts.message && $alerts.type) {
        // our local variable will get set immediately from the code at the top with $:. once navigation happens, we clear the alerts store. but our local variable is not yet cleared so it still shows on the page
        alerts.clearAlert()
      } else {
        // on subsequent page navigations, we set our local variables to null so the alert div element gets hidden
        alertType = $alerts.type
        alertMessage = $alerts.message
      }
    }
  
    // this gets called as soon as navigation happens
    afterNavigate(() => resetAlerts())
  </script>
  
  
  {#if alertMessage}
  <div class="container mx-auto px-2 lg:px-0">
    <div class="alert {alertType} shadow-lg">
      <div class="flex" >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="ml-3">{alertMessage}</span>
      </div>
    </div>
  </div>
  {/if}