extends SceneTree
func _initialize() -> void:
	call_deferred("capture")
func capture() -> void:
	var viewport := SubViewport.new()
	viewport.size = Vector2i(192, 224)
	viewport.transparent_bg = true
	viewport.own_world_3d = true
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(viewport)
	var model = load("res://scenes/asesino_modelo.tscn").instantiate()
	viewport.add_child(model)
	model.rotation.y = -0.25
	var camera := Camera3D.new()
	viewport.add_child(camera)
	camera.projection = Camera3D.PROJECTION_ORTHOGONAL
	camera.size = 2.65
	camera.position = Vector3(0, 3.4, 4.8)
	camera.look_at(Vector3(0, 1.0, 0))
	camera.current = true
	var world := WorldEnvironment.new()
	world.environment = Environment.new()
	world.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	world.environment.ambient_light_color = Color("b9c9df")
	world.environment.ambient_light_energy = 0.85
	viewport.add_child(world)
	var light := DirectionalLight3D.new()
	light.rotation_degrees = Vector3(-45, -35, 0)
	light.light_energy = 1.6
	viewport.add_child(light)
	var rim := DirectionalLight3D.new()
	rim.rotation_degrees = Vector3(-25, 145, 0)
	rim.light_color = Color("9cb9df")
	rim.light_energy = 1.1
	viewport.add_child(rim)
	var atlas := Image.create(192 * 8, 224, false, Image.FORMAT_RGBA8)
	for i in range(8):
		model.animate_run(110.0 / 8.0)
		await process_frame
		await RenderingServer.frame_post_draw
		var frame := viewport.get_texture().get_image()
		atlas.blit_rect(frame, Rect2i(0, 0, 192, 224), Vector2i(i * 192, 0))
	var destination := OS.get_cmdline_user_args()[0]
	var result := atlas.save_png(destination)
	print("ASSASSIN_ATLAS: ", result)
	quit(result)
