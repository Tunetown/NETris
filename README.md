# NETris

Basically this just puts [EmulatorJS](https://emulatorjs.org/) pre-configured for NES emulation into a very basic [PWA](https://developer.mozilla.org/de/docs/Web/Progressive_web_apps).

You have to provide the ROM to load due to licensing issues. The ROMs will be stored in local storage so you have to only load them once on each device.

## Deployment

Just put the content of htdocs on your web space.

For local development there is a simple docker compose setup, binding an apache to localhost port 80. Just run it using 

```bash
docker compose up -d
```



