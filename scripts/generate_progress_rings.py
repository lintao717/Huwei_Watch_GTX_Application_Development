from pathlib import Path
import math

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "entry" / "src" / "main" / "js" / "MainAbility" / "common" / "images"

SIZE = 454
SCALE = 4
CANVAS_SIZE = SIZE * SCALE
CENTER = 227 * SCALE
RADIUS = 217 * SCALE
RING_WIDTH = 20 * SCALE
CAP_RADIUS = RING_WIDTH / 2
TRACK_COLOR = (232, 232, 232, 255)
ACTIVE_COLOR = (10, 132, 255, 255)
FULL_CIRCLE = math.pi * 2
TINY_GAP = 0.18
START_ANGLE = -math.pi / 2


def point_at(angle):
    return (
        CENTER + math.cos(angle) * RADIUS,
        CENTER + math.sin(angle) * RADIUS,
    )


def arc_points(start_angle, end_angle, steps):
    return [point_at(start_angle + (end_angle - start_angle) * i / steps) for i in range(steps + 1)]


def draw_ring(percent):
    image = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)

    track_points = arc_points(0, FULL_CIRCLE, 720)
    draw.line(track_points, fill=TRACK_COLOR, width=RING_WIDTH, joint="curve")

    if percent > 0:
        sweep = (FULL_CIRCLE - TINY_GAP) * percent / 100
        end_angle = START_ANGLE + sweep
        active_points = arc_points(START_ANGLE, end_angle, max(8, int(720 * percent / 100)))
        draw.line(active_points, fill=ACTIVE_COLOR, width=RING_WIDTH, joint="curve")

        for cap_x, cap_y in (point_at(START_ANGLE), point_at(end_angle)):
            draw.ellipse(
                (
                    cap_x - CAP_RADIUS,
                    cap_y - CAP_RADIUS,
                    cap_x + CAP_RADIUS,
                    cap_y + CAP_RADIUS,
                ),
                fill=ACTIVE_COLOR,
            )

    return image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for percent in range(101):
        image = draw_ring(percent)
        image.save(OUTPUT_DIR / f"progress_ring_{percent:03d}.png", optimize=True, compress_level=9)


if __name__ == "__main__":
    main()
