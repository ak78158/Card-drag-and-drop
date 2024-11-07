# Card-drag-and-drop

Added one project to show drag and drop card

This project allows users to reorder cards using drag-and-drop and view images in an overlay modal by clicking on them.

## Features

- **Drag and Drop**: Reorder cards by dragging and dropping.
- **Image Modal**: Click on a card image to view it in an overlay modal.
- **Escape Key Close**: Press `ESC` to close the modal.

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   Navigate to the project directory:
   ```

   ```bash
   cd your-repo
   ```

   Install dependencies:

```bash
 npm install
```

Run the project:

```bash
npm start
```

Open your browser and go to http://localhost:5173 to view the app.

Project Structure
src/components/Home: Main component with card display and drag-and-drop logic.
src/components/Card: Individual card component that supports drag-and-drop and click-to-open modal.
src/components/ImageModal: Modal component to display an image overlay.
src/data/data.js: Sample data for the cards.

Customizing
Modify images url or data in src/data/data.js as needed.
