<script>
    import "../app.css";
    import Alerts from "../lib/Alerts.svelte";
    import Navbar from "../lib/Navbar.svelte";
</script>
  
<div class="min-h-screen">
    <Navbar/>
    <Alerts/>
    <slot />
</div>
