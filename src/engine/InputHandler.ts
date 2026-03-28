export class InputHandler {
  public keys: { [key: string]: boolean } = {};
  public justPressed: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.keys[e.code]) {
      this.justPressed[e.code] = true;
    }
    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
    this.justPressed[e.code] = false;
  };

  public isDown(code: string): boolean {
    return !!this.keys[code];
  }

  public isJustPressed(code: string): boolean {
    if (this.justPressed[code]) {
      this.justPressed[code] = false; // consume it
      return true;
    }
    return false;
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
