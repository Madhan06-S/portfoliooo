import bpy

# Delete existing objects
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

# Create test cube
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))

cube = bpy.context.active_object
cube.name = "Antigravity_MCP_TestCube"

print("================================")
print("BLENDER MCP TEST SUCCESS")
print("Cube created successfully!")
print("================================")
