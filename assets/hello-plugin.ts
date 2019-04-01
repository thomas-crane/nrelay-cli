import { Client, Library, PacketHook, TextPacket, PlayerTextPacket } from 'nrelay';

// The Library decorator gives nrelay some information about
// your plugin. If it is not present, nrelay won't load the plugin.
@Library({
  name: 'Hello Plugin',
  author: 'tcrane',
})
class HelloPlugin {

  // The HookPacket decorator will cause the method to be called
  // whenever a packet with the specified packet type is recieved.
  @PacketHook()
  // Any method with a HookPacket decorator should always have
  // the method signature (client: Client, packet: Packet).
  onText(client: Client, textPacket: TextPacket): void {

    // Check that the text packet was for the client.
    if (textPacket.recipient === client.playerData.name) {

      // Check that the message was 'hello'
      if (textPacket.text === 'hello') {

        // Make a new player text packet in order to reply.
        const reply = new PlayerTextPacket();
        reply.text = '/tell ' + textPacket.name + ' Hello!';

        // Send the reply.
        client.packetio.sendPacket(reply);
      }
    }
  }
}
