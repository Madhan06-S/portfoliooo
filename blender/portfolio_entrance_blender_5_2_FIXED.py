# pyrefly: ignore [missing-import]
import bpy, math, os, shutil
# pyrefly: ignore [missing-import]
from mathutils import Vector

# ============================================================
# PORTFOLIO ENTRANCE — FINAL ART-DIRECTION 3D BUILD (V3)
# Stylized hand-drawn diorama entrance with full visual depth.
# Compatible with Blender 5.2.1 / EEVEE & React Three Fiber export.
# ============================================================

WORKSPACE_DIR = "/Users/madhan/Downloads/projects/portfolio-itom-main"
if os.path.exists(WORKSPACE_DIR):
    OUT_DIR = os.path.join(WORKSPACE_DIR, "public", "models")
else:
    OUT_DIR = os.path.expanduser("~/Desktop/portfolio-entrance-build/public/models")

os.makedirs(OUT_DIR, exist_ok=True)

BLEND_PATH = os.path.join(OUT_DIR, "portfolio-entrance.blend")
GLB_PATH = os.path.join(OUT_DIR, "portfolio-entrance.glb")
PREVIEW_PATH = os.path.join(OUT_DIR, "portfolio-entrance-preview.png")


# -------------------- helpers --------------------

def make_mat(name, color, rough=0.75, metallic=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bs = m.node_tree.nodes.get("Principled BSDF")
    if bs:
        bs.inputs["Base Color"].default_value = (*color, 1)
        bs.inputs["Roughness"].default_value = rough
        bs.inputs["Metallic"].default_value = metallic
    return m


def cube(name, loc, dims, material, bevel=0.0, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        o.data.materials.append(material)
    if bevel > 0:
        mod = o.modifiers.new("Soft_Edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    if parent:
        o.parent = parent
    return o


def sphere(name, loc, scale, material, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=24, ring_count=12, location=loc, rotation=rot
    )
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


def cyl(name, loc, radius, depth, material, vertices=20, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=loc,
        rotation=rot,
    )
    o = bpy.context.object
    o.name = name
    if material:
        o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


def cone(name, loc, r1, r2, depth, material, vertices=16, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=r1,
        radius2=r2,
        depth=depth,
        location=loc,
        rotation=rot,
    )
    o = bpy.context.object
    o.name = name
    if material:
        o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


def empty(name, loc, parent=None):
    o = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(o)
    o.location = loc
    if parent:
        o.parent = parent
    return o


def look_at(obj, target):
    obj.rotation_euler = (
        Vector(target) - obj.location
    ).to_track_quat("-Z", "Y").to_euler()


def text_obj(name, body, loc, size, material, extrude=0.025, align="CENTER", parent=None):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.size = size
    cu.extrude = extrude
    cu.bevel_depth = 0.005
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (math.pi / 2, 0, 0)
    o.data.materials.append(material)
    if parent:
        o.parent = parent
    return o


# -------------------- materials --------------------

INK = make_mat("Ink_Black", (0.018, 0.016, 0.014), 0.92)
PAPER = make_mat("Warm_Paper", (0.78, 0.71, 0.60), 0.95)
COURTYARD = make_mat("Courtyard_Floor", (0.68, 0.62, 0.52), 0.92)
BRICK = make_mat("Warm_Brick", (0.43, 0.20, 0.12), 0.90)
MORTAR = make_mat("Dark_Mortar", (0.16, 0.11, 0.08), 1.0)
WOOD = make_mat("Door_Wood", (0.20, 0.075, 0.030), 0.76)
WOOD2 = make_mat("Sign_Wood", (0.32, 0.13, 0.045), 0.82)
METAL = make_mat("Dark_Metal", (0.045, 0.05, 0.055), 0.32, 0.45)
LEAF = make_mat("Leaf_Dark", (0.055, 0.19, 0.065), 0.92)
LEAF2 = make_mat("Leaf_Light", (0.14, 0.32, 0.08), 0.92)
LEAF3 = make_mat("Leaf_Warm", (0.22, 0.38, 0.10), 0.90)
POT = make_mat("Terracotta", (0.47, 0.17, 0.055), 0.82)
SOIL = make_mat("Dark_Soil", (0.08, 0.05, 0.03), 0.98)
YELLOW = make_mat("Duck_Yellow", (0.92, 0.56, 0.035), 0.65)
ORANGE = make_mat("Beak_Orange", (0.90, 0.35, 0.02), 0.70)
WHITE = make_mat("Paper_White", (0.91, 0.87, 0.78), 0.85)
BLACK = make_mat("Deep_Black", (0.008, 0.007, 0.006), 0.86)
GLASS = make_mat("Window_Glass", (0.10, 0.22, 0.24), 0.20)
STONE = make_mat("Path_Stone", (0.32, 0.30, 0.26), 0.95)
GREEN = make_mat("Plant_Green", (0.10, 0.25, 0.055), 0.92)


# -------------------- reset scene --------------------

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


# -------------------- world + ground --------------------

world = bpy.context.scene.world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (
    0.055, 0.043, 0.032, 1
)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.35

# Courtyard ground
cube("Entrance_Ground", (0, 1.0, -0.14), (18, 15, 0.28), COURTYARD, 0.06)


# -------------------- brick wall (Entrance_Wall) --------------------

wall_root = empty("Entrance_Wall", (0, 0, 0))

W, H, T = 14.0, 7.0, 0.55
door_w = 1.9
door_h = 3.2
opening = door_w * 2
side = (W - opening) / 2

cube("Wall_Left", (-(opening / 2 + side / 2), 0, H / 2), (side, T, H), BRICK, 0.045, parent=wall_root)
cube("Wall_Right", ((opening / 2 + side / 2), 0, H / 2), (side, T, H), BRICK, 0.045, parent=wall_root)
cube("Wall_Top", (0, 0, door_h + (H - door_h) / 2), (opening, T, H - door_h), BRICK, 0.045, parent=wall_root)

# Multi-layered raised brick details for realistic texture & shadow
for row, z in enumerate([0.38, 0.92, 1.46, 2.00, 2.54, 3.08, 3.62, 4.16, 4.70, 5.24, 5.78, 6.32]):
    offset = 0.58 if row % 2 else 0.0
    x = -W / 2 + 0.45 + offset
    while x < W / 2 - 0.25:
        if z < door_h and abs(x) < opening / 2 + 0.30:
            x += 1.05
            continue
        cube("Raised_Brick", (x, -T / 2 - 0.035, z), (0.96, 0.07, 0.43), MORTAR, 0.012, parent=wall_root)
        x += 1.05


# -------------------- door frame & double doors --------------------

frame_t = 0.22
cube("Frame_Top", (0, -0.38, door_h + 0.12), (opening + 0.44, 0.32, 0.24), WOOD2, 0.04, parent=wall_root)
cube("Frame_Left", (-opening / 2 - 0.11, -0.38, door_h / 2), (frame_t, 0.32, door_h), WOOD2, 0.04, parent=wall_root)
cube("Frame_Right", (opening / 2 + 0.11, -0.38, door_h / 2), (frame_t, 0.32, door_h), WOOD2, 0.04, parent=wall_root)
cube("Interior_Dark", (0, 0.20, door_h / 2), (opening - 0.05, 0.10, door_h - 0.05), BLACK, 0.01, parent=wall_root)

# Hinges for interactive door rotation
left_hinge = empty("Left_Door_Hinge", (-opening / 2, -0.46, 0), parent=wall_root)
right_hinge = empty("Right_Door_Hinge", (opening / 2, -0.46, 0), parent=wall_root)

left_door = cube("Left_Door", (door_w / 2, 0, door_h / 2), (door_w, 0.20, door_h), WOOD, 0.045, parent=left_hinge)
right_door = cube("Right_Door", (-door_w / 2, 0, door_h / 2), (door_w, 0.20, door_h), WOOD, 0.045, parent=right_hinge)

# Door inset panels
for parent, sign in [(left_hinge, 1), (right_hinge, -1)]:
    for z in (0.72, 1.62, 2.52):
        cube("Door_Inset", (sign * 0.95, -0.115, z), (1.46, 0.035, 0.55), WOOD2, 0.025, parent=parent)

# Handles & Hinges
cyl("Door_Handle_Left", (0.18, -0.20, 1.60), 0.055, 0.45, METAL, 16, rot=(math.pi / 2, 0, 0), parent=left_hinge)
cyl("Door_Handle_Right", (-0.18, -0.20, 1.60), 0.055, 0.45, METAL, 16, rot=(math.pi / 2, 0, 0), parent=right_hinge)

for parent, sign in [(left_hinge, 1), (right_hinge, -1)]:
    for z in (0.55, 2.65):
        cyl("Door_Hinge", (sign * 0.02, -0.16, z), 0.045, 0.18, METAL, 12, rot=(0, math.pi / 2, 0), parent=parent)

# Door opening keyframes
left_hinge.rotation_mode = "XYZ"
right_hinge.rotation_mode = "XYZ"
left_hinge.rotation_euler.y = 0
right_hinge.rotation_euler.y = 0
left_hinge.keyframe_insert("rotation_euler", frame=1, index=1)
right_hinge.keyframe_insert("rotation_euler", frame=1, index=1)
left_hinge.rotation_euler.y = math.radians(-78)
right_hinge.rotation_euler.y = math.radians(78)
left_hinge.keyframe_insert("rotation_euler", frame=55, index=1)
right_hinge.keyframe_insert("rotation_euler", frame=55, index=1)
left_hinge.rotation_euler.y = math.radians(-78)
right_hinge.rotation_euler.y = math.radians(78)


# -------------------- tech plaques --------------------

for x, z, label in [
    (-0.65, 2.45, "AI"),
    (0.65, 2.45, "</>"),
    (-0.65, 1.95, "JS"),
    (0.65, 1.95, "ML"),
]:
    cube("Tech_Plaque", (x, -0.60, z), (0.42, 0.06, 0.30), METAL, 0.03, parent=wall_root)
    text_obj("Tech_Label", label, (x, -0.635, z), 0.12, WHITE, 0.005, parent=wall_root)


# -------------------- PORTFOLIO hanging sign --------------------

sign_root = empty("Portfolio_Sign_Root", (0, -0.96, 4.72))
cube("Sign_Beam", (0, -0.86, 5.72), (4.35, 0.30, 0.25), WOOD2, 0.05)

# Hanging chains
chain_l = empty("Portfolio_Sign_Chain_Left", (-1.82, -0.88, 5.10))
chain_r = empty("Portfolio_Sign_Chain_Right", (1.82, -0.88, 5.10))

for x, parent_c in [(-1.82, chain_l), (1.82, chain_r)]:
    cyl("Sign_Rope", (x, -0.86, 5.10), 0.025, 1.10, METAL, 10)
    for z in (4.70, 4.90, 5.10):
        torus = bpy.ops.mesh.primitive_torus_add(
            major_radius=0.055, minor_radius=0.012, major_segments=12, minor_segments=6,
            location=(x, -0.88, z), rotation=(0, math.pi / 2, 0),
        )
        o = bpy.context.object
        o.data.materials.append(METAL)
        o.parent = parent_c

sign_board = cube("Portfolio_Sign", (0, 0, 0), (3.65, 0.25, 0.82), WOOD2, 0.07, parent=sign_root)
text_obj("Portfolio_Sign_Text", "PORTFOLIO", (0, -0.15, -0.02), 0.40, WHITE, 0.018, parent=sign_root)

# Sway animation
sign_root.rotation_mode = "XYZ"
sign_root.rotation_euler.y = math.radians(-2.5)
sign_root.keyframe_insert("rotation_euler", frame=1, index=1)
sign_root.rotation_euler.y = math.radians(2.5)
sign_root.keyframe_insert("rotation_euler", frame=40, index=1)
sign_root.rotation_euler.y = math.radians(-2.5)
sign_root.keyframe_insert("rotation_euler", frame=80, index=1)
sign_root.rotation_euler.y = 0
sign_root.keyframe_insert("rotation_euler", frame=120, index=1)


# -------------------- organic 3D tree (Entrance_Tree) --------------------

tree_root = empty("Entrance_Tree", (-5.05, -0.72, 0))

# Organic trunk with tapered base
cyl("Tree_Trunk", (0, 0, 2.10), 0.52, 4.20, WOOD2, 16, parent=tree_root)

# Tree branches
branches_data = [
    (( -0.25, 0.0, 3.35), (0, 0.25, -0.35), 0.24, 2.10),
    (( 0.40, 0.0, 3.70), (0, -0.30, 0.30), 0.20, 1.70),
    (( -0.45, 0.0, 4.20), (0, 0.45, -0.25), 0.17, 1.50),
    (( 0.15, 0.0, 4.60), (0.2, 0.1, 0.1), 0.14, 1.20),
]

for i, (loc, rot, radius, length) in enumerate(branches_data):
    cyl("Tree_Branch_%d" % i, loc, radius, length, WOOD2, 14, rot=rot, parent=tree_root)

# Multi-layered organic canopy (varied foliage masses & colors)
leaf_masses = [
    ((-0.85, 0.0, 5.00), (1.15, 0.55, 0.95), LEAF),
    ((0.15, 0.0, 5.40), (1.35, 0.60, 1.10), LEAF2),
    ((0.95, 0.0, 4.90), (1.10, 0.50, 0.90), LEAF3),
    ((-1.00, 0.0, 4.35), (0.95, 0.48, 0.85), LEAF2),
    ((0.60, 0.0, 4.25), (1.05, 0.52, 0.90), LEAF),
    ((1.20, 0.0, 5.55), (0.85, 0.45, 0.75), LEAF3),
    ((-0.30, 0.0, 5.95), (0.95, 0.48, 0.85), LEAF),
    ((-1.40, 0.0, 5.45), (0.75, 0.40, 0.70), LEAF2),
]

for i, (loc, scale, mat) in enumerate(leaf_masses):
    sphere("Tree_Leaf_Clump_%d" % i, loc, scale, mat, parent=tree_root)


# -------------------- hanging mouse (Hanging_Mouse) --------------------

mouse_root = empty("Hanging_Mouse", (-2.55, -0.92, 5.10))

cyl("Mouse_String", (0, 0, -1.0), 0.018, 2.0, METAL, 10, parent=mouse_root)
sphere("Mouse_Body", (0, 0, -2.00), (0.34, 0.22, 0.46), PAPER, parent=mouse_root)
sphere("Mouse_Head", (0, -0.04, -2.34), (0.31, 0.22, 0.28), PAPER, parent=mouse_root)

# Large mouse ears
for sx in (-0.18, 0.18):
    sphere("Mouse_Ear", (sx, -0.02, -2.15), (0.14, 0.04, 0.14), PAPER, parent=mouse_root)

# Mouse nose & eyes
sphere("Mouse_Nose", (0, -0.28, -2.36), (0.04, 0.04, 0.04), BLACK, parent=mouse_root)
for sx in (-0.11, 0.11):
    sphere("Mouse_Eye", (sx, -0.22, -2.32), (0.025, 0.018, 0.025), BLACK, parent=mouse_root)

# Mouse paws/feet
for sx in (-0.12, 0.12):
    sphere("Mouse_Paw", (sx, -0.05, -2.48), (0.06, 0.06, 0.05), PAPER, parent=mouse_root)

# Mouse tail (Bezier curve)
mouse_curve = bpy.data.curves.new("Mouse_Tail_Curve", "CURVE")
mouse_curve.dimensions = "3D"
mouse_curve.bevel_depth = 0.028
mouse_curve.bevel_resolution = 3
mouse_spline = mouse_curve.splines.new("BEZIER")
mouse_spline.bezier_points.add(2)
for bp, co in zip(
    mouse_spline.bezier_points,
    [(0.18, 0, -2.55), (0.58, 0, -2.72), (0.80, 0, -2.48)]
):
    bp.co = co
    bp.handle_left_type = "AUTO"
    bp.handle_right_type = "AUTO"
mouse_tail = bpy.data.objects.new("Mouse_Tail", mouse_curve)
bpy.context.collection.objects.link(mouse_tail)
mouse_tail.data.materials.append(PAPER)
mouse_tail.parent = mouse_root

# Mouse swinging animation
mouse_root.rotation_mode = "XYZ"
for frame, angle in [(1, -4), (35, 4), (70, -3), (105, 0), (120, 0)]:
    mouse_root.rotation_euler.y = math.radians(angle)
    mouse_root.keyframe_insert("rotation_euler", frame=frame, index=1)


# -------------------- cat (Cat) --------------------

cat_root = empty("Cat", (-2.45, -0.88, 0.78))

sphere("Cat_Body", (0, 0, 0), (0.58, 0.32, 0.52), PAPER, parent=cat_root)
sphere("Cat_Head", (0, -0.04, 0.52), (0.44, 0.28, 0.38), PAPER, parent=cat_root)

# Pointed ears
for sx in (-0.28, 0.28):
    cone("Cat_Ear", (sx, -0.03, 0.86), 0.16, 0.0, 0.32, PAPER, 3, rot=(0, 0, math.radians(90 if sx > 0 else -90)), parent=cat_root)

# Eyes & Muzzle
for sx in (-0.14, 0.14):
    sphere("Cat_Eye", (sx, -0.28, 0.56), (0.045, 0.025, 0.06), BLACK, parent=cat_root)

sphere("Cat_Muzzle", (0, -0.28, 0.48), (0.08, 0.05, 0.06), PAPER, parent=cat_root)

# 4 Paws
for sx in (-0.22, 0.22):
    sphere("Cat_Paw_Front", (sx, -0.22, -0.22), (0.10, 0.12, 0.08), PAPER, parent=cat_root)
    sphere("Cat_Paw_Back", (sx, 0.18, -0.22), (0.12, 0.12, 0.09), PAPER, parent=cat_root)

# Cat Tail (Bezier curve)
cat_curve = bpy.data.curves.new("Cat_Tail_Curve", "CURVE")
cat_curve.dimensions = "3D"
cat_curve.bevel_depth = 0.055
cat_curve.bevel_resolution = 3
cat_spline = cat_curve.splines.new("BEZIER")
cat_spline.bezier_points.add(2)
for bp, co in zip(
    cat_spline.bezier_points,
    [(-0.48, 0, 0.05), (-0.95, 0, 0.30), (-0.78, 0, 0.75)]
):
    bp.co = co
    bp.handle_left_type = "AUTO"
    bp.handle_right_type = "AUTO"

cat_tail = bpy.data.objects.new("Cat_Tail", cat_curve)
bpy.context.collection.objects.link(cat_tail)
cat_tail.data.materials.append(PAPER)
cat_tail.parent = cat_root

# Cat idle animation
cat_root.rotation_mode = "XYZ"
for frame, angle in [(1, -1), (45, 1), (90, 0), (120, 0)]:
    cat_root.rotation_euler.z = math.radians(angle)
    cat_root.keyframe_insert("rotation_euler", frame=frame, index=2)


# -------------------- recessed window (Entrance_Window) --------------------

win_root = empty("Entrance_Window", (4.55, -0.43, 3.75))

cube("Window_Frame", (0, 0, 0), (2.55, 0.30, 2.00), WOOD2, 0.05, parent=win_root)
cube("Window_Recess", (0, 0.10, 0), (2.25, 0.20, 1.70), MORTAR, 0.02, parent=win_root)
cube("Window_Glass", (0, -0.17, 0), (2.18, 0.06, 1.62), GLASS, 0.02, parent=win_root)
cube("Window_Mullion_V", (0, -0.22, 0), (0.08, 0.05, 1.62), WOOD2, 0.01, parent=win_root)
cube("Window_Mullion_H", (0, -0.22, 0), (2.18, 0.05, 0.08), WOOD2, 0.01, parent=win_root)
cube("Window_Sill", (0, -0.25, -0.96), (2.65, 0.22, 0.12), WOOD2, 0.03, parent=win_root)

# Avatar Silhouette behind glass
sphere("Avatar_Head", (0, -0.26, 0.30), (0.27, 0.08, 0.27), WHITE, parent=win_root)
cyl("Avatar_Body", (0, -0.26, -0.18), 0.30, 0.45, WHITE, 20, rot=(math.pi / 2, 0, 0), parent=win_root)


# -------------------- planter + duck (Planter & Rubber_Duck) --------------------

planter_root = empty("Planter_Group", (3.70, -0.78, 0.45))

cyl("Planter", (0, 0, 0), 0.48, 0.70, POT, 24, parent=planter_root)
cyl("Planter_Rim", (0, 0, 0.33), 0.52, 0.12, POT, 24, parent=planter_root)
cyl("Planter_Soil", (0, 0, 0.32), 0.46, 0.05, SOIL, 20, parent=planter_root)

# 10 angled green leaves
for i in range(10):
    a = i * math.tau / 10
    sphere(
        "Plant_Leaf_%d" % i,
        (
            0.35 * math.cos(a),
            0.03 * math.sin(a),
            0.48 + 0.16 * math.sin(a),
        ),
        (0.08, 0.045, 0.40),
        GREEN,
        parent=planter_root,
        rot=(0.2 * math.cos(a), 0.2 * math.sin(a), a),
    )

# Rubber duck
duck_root = empty("Rubber_Duck", (3.70, -1.00, 1.10))
sphere("Duck_Body", (0, 0, 0), (0.30, 0.23, 0.23), YELLOW, parent=duck_root)
sphere("Duck_Head", (0, -0.02, 0.27), (0.22, 0.18, 0.22), YELLOW, parent=duck_root)
cone("Duck_Beak", (0, -0.20, 0.27), 0.09, 0.0, 0.18, ORANGE, 4, rot=(math.pi / 2, 0, 0), parent=duck_root)

for sx in (-0.07, 0.07):
    sphere("Duck_Eye", (sx, -0.18, 0.35), (0.025, 0.015, 0.025), BLACK, parent=duck_root)


# -------------------- continuous stone path (Stone_Path) --------------------

path_root = empty("Stone_Path", (0, 0, 0))

# 11 stones guiding from foreground (y=-4.6) to doorway (y=-1.2)
stones_data = [
    ( 0.00, -4.60, 0.85, 0.70, 4),
    (-0.65, -4.10, 0.75, 0.65, -6),
    ( 0.75, -3.75, 0.78, 0.65, 8),
    (-0.35, -3.35, 0.80, 0.65, -4),
    ( 0.45, -2.95, 0.72, 0.62, 5),
    (-0.55, -2.55, 0.76, 0.64, -7),
    ( 0.30, -2.15, 0.74, 0.62, 6),
    (-0.40, -1.75, 0.78, 0.65, -5),
    ( 0.25, -1.40, 0.72, 0.60, 4),
    (-0.20, -1.10, 0.70, 0.58, -3),
    ( 0.10, -0.85, 0.68, 0.55, 2),
]

for i, (x, y, w, d, rot) in enumerate(stones_data):
    o = cube(
        "Path_Stone_%02d" % i,
        (x, y, 0.05),
        (w, d, 0.10),
        STONE,
        0.08,
        parent=path_root,
        rot=(0, 0, math.radians(rot)),
    )


# -------------------- hand-drawn ink accent rings --------------------

for x, z, r in [
    (-3.30, 2.90, 0.10),
    (3.90, 2.10, 0.08),
    (-3.70, 1.40, 0.06),
    (3.50, 5.20, 0.07),
]:
    bpy.ops.mesh.primitive_torus_add(
        major_radius=r, minor_radius=0.018, major_segments=16, minor_segments=5,
        location=(x, -0.63, z), rotation=(math.pi / 2, 0, 0),
    )
    bpy.context.object.data.materials.append(INK)


# -------------------- lighting --------------------

bpy.ops.object.light_add(type="AREA", location=(0, -6.5, 7.0))
key = bpy.context.object
key.name = "Soft_Key"
key.data.energy = 1100
key.data.shape = "RECTANGLE"
key.data.size = 8.0
look_at(key, (0, 0, 2.5))

bpy.ops.object.light_add(type="AREA", location=(-5.5, -2.5, 4.0))
fill_tree = bpy.context.object
fill_tree.name = "Tree_Fill"
fill_tree.data.energy = 550
fill_tree.data.size = 5.0
look_at(fill_tree, (-3.5, 0, 2.5))

bpy.ops.object.light_add(type="AREA", location=(5.5, -2.5, 4.0))
fill_win = bpy.context.object
fill_win.name = "Window_Fill"
fill_win.data.energy = 500
fill_win.data.size = 4.5
look_at(fill_win, (3.5, 0, 2.5))

bpy.ops.object.light_add(type="AREA", location=(0, 2.0, 3.5))
rim = bpy.context.object
rim.name = "Interior_Glow"
rim.data.energy = 750
rim.data.size = 4.0
look_at(rim, (0, 0, 2.0))


# -------------------- camera --------------------

bpy.ops.object.camera_add(location=(0, -17.5, 3.45))
cam = bpy.context.object
cam.name = "Entrance_Camera"
cam.data.lens = 48
cam.data.sensor_width = 36
look_at(cam, (0, -0.20, 2.50))
bpy.context.scene.camera = cam


# -------------------- render settings --------------------

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 120
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1100
scene.render.resolution_y = 700
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = PREVIEW_PATH
scene.render.film_transparent = False
scene.render.fps = 24

try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass


# -------------------- save + export --------------------

bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)

bpy.ops.export_scene.gltf(
    filepath=GLB_PATH,
    export_format="GLB",
    use_selection=False,
)

scene.render.filepath = PREVIEW_PATH
bpy.ops.render.render(write_still=True)

# Also copy build files to Desktop fallback folder for backup
desktop_dir = os.path.expanduser("~/Desktop/portfolio-entrance-build/public/models")
if OUT_DIR != desktop_dir:
    os.makedirs(desktop_dir, exist_ok=True)
    shutil.copy2(BLEND_PATH, os.path.join(desktop_dir, "portfolio-entrance.blend"))
    shutil.copy2(GLB_PATH, os.path.join(desktop_dir, "portfolio-entrance.glb"))
    shutil.copy2(PREVIEW_PATH, os.path.join(desktop_dir, "portfolio-entrance-preview.png"))

print("")
print("======================================================")
print("PORTFOLIO ENTRANCE 3D BUILD V3 FINAL ART PASS SUCCESS")
print("======================================================")
print("BLEND :", BLEND_PATH)
print("GLB   :", GLB_PATH)
print("IMAGE :", PREVIEW_PATH)
print("======================================================")

result = {
    "status": "PORTFOLIO ENTRANCE 3D BUILD V3 FINAL ART PASS SUCCESS",
    "blend_path": BLEND_PATH,
    "glb_path": GLB_PATH,
    "preview_path": PREVIEW_PATH,
}
