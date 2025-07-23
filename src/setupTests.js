import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
}));

// Mock Canvas toDataURL
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,test');

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock File and FileReader for React components that use file uploads
global.File = class MockFile {
  constructor(fileBits, fileName, options = {}) {
    this.name = fileName;
    this.size = fileBits.length || 0;
    this.type = options.type || '';
  }
};

global.FileReader = class MockFileReader {
  constructor() {
    this.readAsDataURL = jest.fn();
    this.onload = null;
  }
};

// Mock TextEncoder and TextDecoder for modern browser APIs
global.TextEncoder = class TextEncoder {
  encode(string) {
    return new Uint8Array([...string].map(char => char.charCodeAt(0)));
  }
};

global.TextDecoder = class TextDecoder {
  decode(uint8Array) {
    return String.fromCharCode(...uint8Array);
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
global.File = class File {
  constructor(fileBits, fileName, options) {
    this.fileBits = fileBits;
    this.name = fileName;
    this.size = options?.size || 1024;
    this.type = options?.type || 'text/plain';
  }
};

global.FileReader = class FileReader {
  constructor() {
    this.readAsDataURL = jest.fn(function() {
      this.onloadend && this.onloadend();
    });
    this.result = 'data:image/jpeg;base64,test';
  }
};
